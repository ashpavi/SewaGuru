import Subscription from '../models/subscription.js';
import User from '../models/user.js'; // Assuming your User model path
import { calculateNextBillingDate } from '../utils/billing.js'; // Optional utility

// Function to create a new subscription
export const createSubscription = async (req, res) => {
    console.log('Request Body:', req.body)
    try {
        const { planType, transactionId, subscriptionDurationMonths = 1, customerName, customerContact, customerAddress } = req.body;
        const customerId = req.user.id; // Assuming req.user is populated by your authentication middleware

        if (!customerId || !planType || !transactionId || !customerName || !customerContact || !customerAddress) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        if (!['Home Essentials Plan', 'Premium Care Plan'].includes(planType)) {
            return res.status(400).json({ message: 'Invalid plan type.' });
        }

        const startDate = new Date();
        const nextBillingDate = calculateNextBillingDate(startDate, 'monthly');

        let endDate = null;
        if (subscriptionDurationMonths > 0) {
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + subscriptionDurationMonths);
        }

        const newSubscription = new Subscription({
            customerId,
            customerName,       
            customerContact,     
            customerAddress,     
            startDate,
            endDate,
            nextBillingDate,
            paymentStatus: 'paid',
            paymentMethod: 'online',
            transactionId
        });

        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ message: 'Failed to create subscription.', error: error.message });
    }
};

// Function to get a subscription by ID
export const getSubscriptionById = async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        const subscription = await Subscription.findById(subscriptionId).populate('customerId', 'firstName lastName email');
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }
        res.status(200).json(subscription);
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).json({ message: 'Failed to get subscription.', error: error.message });
    }
};

// Function to get all subscriptions for a user
export const getSubscriptionsByUser = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const subscriptions = await Subscription.find({ customerId }).populate('customerId', 'firstName lastName email');
        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error getting user subscriptions:', error);
        res.status(500).json({ message: 'Failed to get user subscriptions.', error: error.message });
    }
};

// Function to update a subscription (e.g., cancel)
export const updateSubscription = async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        const updates = req.body;

        // Prevent updating immutable fields
        if (updates.billingCycle || updates.paymentMethod) {
            return res.status(400).json({ message: 'Cannot update billing cycle or payment method.' });
        }

        const updatedSubscription = await Subscription.findByIdAndUpdate(subscriptionId, updates, { new: true });
        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }
        res.status(200).json(updatedSubscription);
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ message: 'Failed to update subscription.', error: error.message });
    }
};

// Function to delete a subscription
export const deleteSubscription = async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        const deletedSubscription = await Subscription.findByIdAndDelete(subscriptionId);
        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found.' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully.' });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ message: 'Failed to delete subscription.', error: error.message });
    }
};

// Optional: Function to handle recurring billing (example - you'd need to integrate with a payment gateway)
export const processMonthlyBilling = async () => {
    try {
        const today = new Date();
        const subscriptionsDue = await Subscription.find({
            nextBillingDate: { $lte: today },
            subscriptionStatus: 'active',
            paymentStatus: { $ne: 'paid' } // Avoid double charging if something went wrong
        }).populate('customerId');

        for (const subscription of subscriptionsDue) {
            const user = subscription.customerId;
            const planType = subscription.planType;
            let amountToCharge;

            // Determine the amount based on the planType (you might fetch this from a config or a simple object)
            if (planType === 'Home Essentials Plan') {
                amountToCharge = 2500; // LKR
            } else if (planType === 'Premium Care Plan') {
                amountToCharge = 4500; // LKR
            } else {
                console.warn(`Unknown plan type: ${planType} for subscription ${subscription._id}`);
                continue;
            }

            // Simulate charging the user (replace with actual payment gateway integration)
            console.log(`Simulating charging ${user.firstName} (${user.email}) LKR ${amountToCharge} for subscription ${subscription._id}`);

            // If the charge is successful (replace with actual success check)
            const paymentSuccessful = true;
            if (paymentSuccessful) {
                subscription.paymentStatus = 'paid';
                subscription.nextBillingDate = calculateNextBillingDate(subscription.nextBillingDate, 'monthly');
                await subscription.save();
                console.log(`Billing successful for subscription ${subscription._id}`);
                // Optionally send a confirmation email to the user
            } else {
                subscription.paymentStatus = 'failed';
                await subscription.save();
                console.error(`Billing failed for subscription ${subscription._id}`);
                // Optionally send a payment failure notification to the user
            }
        }
    } catch (error) {
        console.error('Error processing monthly billing:', error);
    }
};

export const getAllActiveSubscriptions = async (req, res) => {
    try {
        const today = new Date();
        const activeSubscriptions = await Subscription.find({
            $or: [
                { endDate: { $gt: today } }, // endDate is in the future
                { endDate: null }             // No end date (ongoing)
            ],
            paymentStatus: 'paid'
        }).populate('customerId', 'firstName lastName email'); // Populate customer details
        res.status(200).json(activeSubscriptions);
    } catch (error) {
        console.error('Error getting all active subscriptions:', error);
        res.status(500).json({ message: 'Failed to get active subscriptions.', error: error.message });
    }
};

export const getSubscriptionCount = async (req, res) => {
    try {
        const subscriptionCount = await Subscription.countDocuments();
        res.status(200).json({ count: subscriptionCount });
    } catch (error) {
        console.error('Error getting subscription count:', error);
        res.status(500).json({ message: 'Failed to get subscription count.', error: error.message });
    }
};