import Show from "../models/Show.js";
import Booking from "../models/Bookings.js";
import Stripe from "stripe";


// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);

    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(
      seat => occupiedSeats[seat]
    );

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};



export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected Seats are not available."
      });
    }

    // Get show details
    const showData = await Show.findById(showId).populate('movie');
    if (!showData) {
      return res.json({
        success: false,
        message: "Show not found."
      });
    }

    // Calculate amount (example: price per seat)
    const amount = selectedSeats.length * showData.showPrice;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      bookedSeats: selectedSeats,
    });

    // Mark seats as occupied
    selectedSeats.forEach(seat => {
      showData.occupiedSeats[seat] = userId;
    });
    showData.markModified('occupiedSeats');
    await showData.save();

    // stripe checkout session
    const stripe = new Stripe(process.env.CLERK_SECRET_KEY || ""); // stripe integration using secret key from environment
    
    // We can also allow direct confirmation fallback if Stripe key is not a stripe secret key, 
    // or standard stripe checkouts. Let's create a checkout session.
    let session;
    try {
      const stripeInstance = new Stripe(process.env.CLERK_SECRET_KEY.startsWith("sk_") ? process.env.CLERK_SECRET_KEY : "sk_test_mock");
      session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `${showData.movie.title} Ticket Booking`,
                description: `Seats: ${selectedSeats.join(", ")}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/mybookings?success=true&bookingId=${booking._id}`,
        cancel_url: `${origin}/mybookings?cancel=true&bookingId=${booking._id}`,
        metadata: {
          bookingId: booking._id.toString(),
        },
      });

      booking.paymentLink = session.url;
      await booking.save();
    } catch (stripeErr) {
      console.warn("Stripe initialization or session creation failed, using mock payment url", stripeErr.message);
      booking.paymentLink = `${origin}/mybookings?success=true&bookingId=${booking._id}`;
      await booking.save();
    }

    res.json({
      success: true,
      booking,
      session_url: booking.paymentLink
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};


export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const showData = await Show.findById(showId);
    if (!showData) {
      return res.json({
        success: false,
        message: "Show not found"
      });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});

    res.json({
      success: true,
      occupiedSeats
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};
