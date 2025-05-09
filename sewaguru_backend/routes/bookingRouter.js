import express from 'express';
import { findProviders, createBooking, updateBookingStatus } from '../controllers/bookingController.js';
const router = express.Router();

// Route to get providers based on service type and location
router.get('/providers', findProviders);

// Route to create a new booking
router.post('/create', createBooking);

// Route to update booking status
router.patch('/update/:id', updateBookingStatus);

export default router;
