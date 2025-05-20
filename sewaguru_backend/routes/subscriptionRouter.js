// src/routes/subscription.routes.js
import express from 'express';
import {
    createSubscription,
    getSubscriptionById,
    getSubscriptionsByUser,
    updateSubscription,
    deleteSubscription,
    getAllActiveSubscriptions,
    getSubscriptionCount,
    confirmSubscriptionPayment 
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js'; // Assuming you have this middleware
import { adminOnly } from '../middleware/accessLevel.js'; // Assuming you have this middleware

const router = express.Router();

// Route to create a new subscription (requires authentication)
router.post('/', authenticate, createSubscription);

// NEW ROUTE: Route to confirm a payment that required 3D Secure / additional action (requires authentication)
router.post('/confirm-payment', authenticate, confirmSubscriptionPayment);

// Route to get a subscription by ID (can be public or authenticated, depending on your needs)
// You might want to add 'authenticate' here if only logged-in users or admins can view specific subscriptions
router.get('/:id', getSubscriptionById);

// Route to get all subscriptions for a specific user (requires authentication, userId comes from param)
// IMPORTANT: Changed ':customerId' to ':userId' for consistency with the controller
router.get('/user/:userId', authenticate, getSubscriptionsByUser);

// Route to update a subscription by ID (requires authentication)
// You might want specific roles (e.g., admin) for this, or only allow the user to update their own sub.
router.put('/:id', authenticate, updateSubscription);

// Route to delete a subscription by ID (requires authentication and typically adminOnly)
router.delete('/:id', authenticate, adminOnly, deleteSubscription);

// Admin-only routes for active subscriptions and count
router.get('/admin/active', authenticate, adminOnly, getAllActiveSubscriptions);
router.get('/admin/count', authenticate, adminOnly, getSubscriptionCount);

export default router;