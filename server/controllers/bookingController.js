import Show from "../models/Show.js";
import Booking from "../models/Bookings.js";


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
    const amount = selectedSeats.length * showData.price;

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

//stripe gateway




    res.json({
      success: true,
      booking
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
