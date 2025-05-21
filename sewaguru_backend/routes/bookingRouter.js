import express from 'express';
import { findProviders, createBooking, updateBookingStatus, getBookingById, getBookingsByUser, getProviderBookings, deleteBooking, getProviderUpcomingBookings, getProviderBookingSummary } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { providerOnly } from '../middleware/accessLevel.js';
const router = express.Router();
 
// Route to get providers based on service type and location
router.get('/providers', findProviders);

// Route to create a new booking
router.post('/create', createBooking);

// Route to update booking status
router.patch('/update/:id',authenticate,providerOnly, updateBookingStatus);



router.get('/user/:userId', authenticate, getBookingsByUser);

router.get('/provider', authenticate, providerOnly, getProviderBookings);

router.get('/:id', getBookingById);

router.delete('/:id', authenticate, deleteBooking);

router.get('/provider/upcoming', authenticate, providerOnly, getProviderUpcomingBookings);

router.get('/provider/summary', authenticate, providerOnly, getProviderBookingSummary);

export default router;
