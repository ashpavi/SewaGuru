import express from 'express';
import {
    createSubscription,
    getSubscriptionById,
    getSubscriptionsByUser,
    updateSubscription,
    deleteSubscription,
    getAllActiveSubscriptions,
    getSubscriptionCount
} from '../controllers/subscriptionController.js'; 
import { authenticate } from '../middleware/auth.js';
import { adminOnly } from '../middleware/accessLevel.js';



const router = express.Router();

// Route to create a new subscription
router.post('/', authenticate, createSubscription);

// Route to get a subscription by ID
router.get('/:id', getSubscriptionById);

// Route to get all subscriptions for a specific user
router.get('/user/:customerId', getSubscriptionsByUser);

// Route to update a subscription by IDrs
router.put('/:id', updateSubscription);

// Route to delete a subscription by ID
router.delete('/:id', deleteSubscription);

router.get('/admin/active', authenticate, adminOnly, getAllActiveSubscriptions);

router.get('/admin/count', authenticate, adminOnly, getSubscriptionCount);


export default router; 