import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';
import Booking from '../models/Bookings.js';

const bookingRouter = express.Router();


bookingRouter.post('/create',createBooking)
bookingRouter.get('/seats/:showId',getOccupiedSeats)

bookingRouter.post('/confirm-payment', async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.isPaid = true;
      await booking.save();
      return res.json({ success: true, message: "Payment confirmed successfully!" });
    }
    res.json({ success: false, message: "Booking not found" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default bookingRouter;