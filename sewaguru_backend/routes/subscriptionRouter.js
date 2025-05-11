import express from 'express';
import {
    createSubscription,
    getSubscriptionById,
    getSubscriptionsByUser,
    updateSubscription,
    deleteSubscription
} from '../controllers/subscriptionController.js'; // Updated import path
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Route to create a new subscription
router.post('/', authenticate, createSubscription);

// Route to get a subscription by ID
router.get('/:id', getSubscriptionById);

// Route to get all subscriptions for a specific user
router.get('/user/:customerId', getSubscriptionsByUser);

// Route to update a subscription by ID
router.put('/:id', updateSubscription);

// Route to delete a subscription by ID
router.delete('/:id', deleteSubscription);

export default router; 