import express from 'express';
import { findProviders, createBooking, updateBookingStatus, getBookingById, getBookingsByUser } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

// Route to get providers based on service type and location
router.get('/providers', findProviders);

// Route to create a new booking
router.post('/create', createBooking);

// Route to update booking status
router.patch('/update/:id', updateBookingStatus);

router.get('/:id', getBookingById);

router.get('/user/:userId', authenticate, getBookingsByUser);

export default router;
