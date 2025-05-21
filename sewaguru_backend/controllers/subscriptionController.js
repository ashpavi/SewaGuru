import Subscription from '../models/subscription.js';
import User from '../models/user.js'; // Assuming your User model path
import { sendSubscriptionConfirmationEmail } from '../utils/emailSender.js';

import Stripe from 'stripe'; 
import dotenv from 'dotenv';
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_KEY);

const getStripePriceId = (planType) => {
    switch (planType) {
        case 'Home Essentials Plan':
            return 'price_1RQq8iD5PuptLcZzJWLMczRj'; // Replace with YOUR Home Essentials Price ID
        case 'Premium Care Plan':
            return 'price_1RQjOpD5PuptLcZzvvy5Er5z'; // Replace with YOUR Premium Care Price ID
        default:
            return null;
    }
};


// Function to create a new subscription
export const createSubscription = async (req, res) => {
    console.log('Request Body for createSubscription:', req.body);
    try {
        const {
            planType,
            customerName,
            customerContact,
            customerAddress,
            paymentMethodId,
            notes
        } = req.body;

        const userId = req.user.id;

        if (!userId || !planType || !paymentMethodId || !customerName || !customerContact || !customerAddress) {
            return res.status(400).json({ message: 'Missing required fields for subscription and payment.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const stripePriceId = getStripePriceId(planType);
        if (!stripePriceId) {
            return res.status(400).json({ message: 'Invalid plan type mapping for Stripe.' });
        }

        let stripeCustomerId = user.stripeCustomerId;

        // --- Stripe Customer Creation/Retrieval ---
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email || customerContact,
                name: customerName,
                address: { line1: customerAddress },
                metadata: {
                    yourAppUserId: userId.toString(),
                },
            });
            stripeCustomerId = customer.id;
            user.stripeCustomerId = stripeCustomerId;
            await user.save();
        } else {
            try {
                await stripe.customers.retrieve(stripeCustomerId);
            } catch (retrieveError) {
                console.warn(`Stripe customer ${stripeCustomerId} not found for user ${userId}. Creating new customer.`);
                const customer = await stripe.customers.create({
                    email: user.email || customerContact,
                    name: customerName,
                    address: { line1: customerAddress },
                    metadata: { yourAppUserId: userId.toString() },
                });
                stripeCustomerId = customer.id;
                user.stripeCustomerId = stripeCustomerId;
                await user.save();
            }
        }

        // --- Attach Payment Method and Set Default ---
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
        });

        await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // --- Existing Subscription Check ---
        const existingActiveSubscription = await Subscription.findOne({
            user: userId,
            status: { $in: ['active', 'trialing'] }
        });

        if (existingActiveSubscription) {
            return res.status(400).json({ message: 'User already has an active subscription.' });
        }

        // --- Create Subscription in Stripe ---
        const stripeSubscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ price: stripePriceId }],
            // No expand here for now.
        });

        console.log('Stripe Subscription created:', stripeSubscription);

        let latestInvoice = null;
        let paymentIntent = null;

        if (typeof stripeSubscription.latest_invoice === 'string') {
            const invoiceId = stripeSubscription.latest_invoice;
            console.log('Attempting to retrieve invoice with ID:', invoiceId);
            try {
                latestInvoice = await stripe.invoices.retrieve(invoiceId);
                console.log('Latest Invoice retrieved:', latestInvoice);

                if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === 'string') {
                    paymentIntent = await stripe.paymentIntents.retrieve(latestInvoice.payment_intent);
                    console.log('Payment Intent retrieved via separate call:', paymentIntent);
                } else if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === 'object') {
                    paymentIntent = latestInvoice.payment_intent;
                    console.log('Payment Intent already embedded in invoice:', paymentIntent);
                } else {
                    console.log('No payment_intent ID found on the retrieved invoice or it was not an ID.');
                }

            } catch (invoiceRetrieveError) {
                console.error(`Error retrieving or processing invoice ${invoiceId}:`, invoiceRetrieveError);
            }
        } else if (stripeSubscription.latest_invoice && typeof stripeSubscription.latest_invoice === 'object') {
            latestInvoice = stripeSubscription.latest_invoice;
            console.log('Latest Invoice was already an object on subscription:', latestInvoice);
            if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === 'string') {
                paymentIntent = await stripe.paymentIntents.retrieve(latestInvoice.payment_intent);
                console.log('Payment Intent retrieved via separate call (from pre-expanded invoice):', paymentIntent);
            } else if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === 'object') {
                paymentIntent = latestInvoice.payment_intent;
                console.log('Payment Intent already embedded in pre-expanded invoice:', paymentIntent);
            }
        } else {
            console.log('No latest_invoice found on the created Stripe subscription, or it was not an ID/object.');
        }

        // 5. Determine initial payment status for your database
        let localPaymentStatus = 'pending';
        let localSubscriptionStatus = stripeSubscription.status;

        if (paymentIntent) {
            if (paymentIntent.status === 'succeeded') {
                localPaymentStatus = 'active';
                localSubscriptionStatus = 'active';
            } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
                localPaymentStatus = 'incomplete';
                localSubscriptionStatus = 'incomplete';
                console.warn('Subscription requires additional action (e.g., 3D Secure):', paymentIntent.client_secret);

                return res.status(200).json({
                    message: 'Subscription created but requires further authentication.',
                    stripeSubscriptionId: stripeSubscription.id,
                    clientSecret: paymentIntent.client_secret,
                    requiresAction: true,
                    paymentIntentId: paymentIntent.id
                });
            } else {
                localPaymentStatus = 'failed';
                localSubscriptionStatus = 'canceled';
                console.error('Initial payment for subscription failed:', paymentIntent.status);
                return res.status(400).json({
                    message: `Subscription creation failed due to payment issue: ${paymentIntent.last_payment_error?.message || 'Payment failed.'}`,
                    errorDetails: paymentIntent.last_payment_error,
                    paymentIntentStatus: paymentIntent.status
                });
            }
        } else if (latestInvoice) {
            if (latestInvoice.status === 'paid') {
                localPaymentStatus = 'active';
                localSubscriptionStatus = 'active';
            } else if (latestInvoice.status === 'open') {
                localPaymentStatus = 'pending';
                localSubscriptionStatus = 'active'; // Assuming it's active even if payment is pending for non-trial
            } else if (latestInvoice.status === 'void' || latestInvoice.status === 'uncollectible') {
                localPaymentStatus = 'failed';
                localSubscriptionStatus = 'canceled';
            }
            console.log('No payment intent found, using latest_invoice status:', latestInvoice.status);
        } else {
            localPaymentStatus = stripeSubscription.status; // Default to subscription status
            localSubscriptionStatus = stripeSubscription.status;
            console.log('No payment intent or invoice to evaluate, using Stripe subscription status:', localSubscriptionStatus);
        }

        // --- FIX: Correctly retrieve startDate and endDate from subscription items ---
        let actualStartDate = null;
        let actualEndDate = null;

        if (stripeSubscription.items && stripeSubscription.items.data && stripeSubscription.items.data.length > 0) {
            const subscriptionItem = stripeSubscription.items.data[0];
            if (subscriptionItem.current_period) {
                if (subscriptionItem.current_period.start) {
                    actualStartDate = new Date(subscriptionItem.current_period.start * 1000);
                }
                if (subscriptionItem.current_period.end) {
                    actualEndDate = new Date(subscriptionItem.current_period.end * 1000);
                }
            }
        }

        // Fallback if current_period details are not available on the item (less common but robust)
        if (!actualStartDate && stripeSubscription.start_date) {
            actualStartDate = new Date(stripeSubscription.start_date * 1000);
        }
        if (!actualEndDate && stripeSubscription.plan && stripeSubscription.plan.interval && actualStartDate) {
            // Calculate endDate based on plan interval if not explicitly provided
            const d = new Date(actualStartDate);
            if (stripeSubscription.plan.interval === 'month') {
                d.setMonth(d.getMonth() + stripeSubscription.plan.interval_count);
            } else if (stripeSubscription.plan.interval === 'year') {
                d.setFullYear(d.getFullYear() + stripeSubscription.plan.interval_count);
            }
            // Add more intervals (day, week) if your plans support them
            actualEndDate = d;
        }

        // If after all attempts, dates are still invalid, use creation date as last resort
        if (!actualStartDate || isNaN(actualStartDate.getTime())) {
            console.warn("Couldn't derive valid startDate, using subscription creation date as fallback.");
            actualStartDate = new Date(stripeSubscription.created * 1000);
        }
        if (!actualEndDate || isNaN(actualEndDate.getTime())) {
             console.warn("Couldn't derive valid endDate, setting to 1 year from startDate as fallback.");
             // A very rough fallback, ideally you'd want a more precise end date
             const tempEndDate = new Date(actualStartDate);
             tempEndDate.setFullYear(tempEndDate.getFullYear() + 1); // Default to +1 year if nothing else works
             actualEndDate = tempEndDate;
        }


        // 6. Save the subscription details to your database
        const newSubscription = new Subscription({
            user: userId,
            stripeCustomerId: stripeCustomerId,
            stripeSubscriptionId: stripeSubscription.id,
            planType: planType,
            status: localSubscriptionStatus,
            startDate: actualStartDate, // Use the correctly derived date
            endDate: actualEndDate,     // Use the correctly derived date
            paymentStatus: localPaymentStatus,
            paymentMethod: 'stripe',
            customerName: customerName,
            customerContact: customerContact,
            customerAddress: customerAddress,
            notes: notes
        });

        // Add a log right before saving to check the actual date values
        console.log('Attempting to save subscription with startDate:', newSubscription.startDate, 'and endDate:', newSubscription.endDate);


        const savedSubscription = await newSubscription.save();
        console.log('New Subscription saved to DB:', savedSubscription);

        // --- Send Subscription Confirmation Email ---
        // ONLY send if the payment was successful (not requiring action or failed)
        if (localPaymentStatus === 'active' && localSubscriptionStatus === 'active') {
            try {
                await sendSubscriptionConfirmationEmail(
                    user.email, // Or customerEmail from req.body if you prefer
                    {
                        customerName: customerName,
                        planType: planType,
                        startDate: savedSubscription.startDate,
                        endDate: savedSubscription.endDate,
                        paymentStatus: savedSubscription.paymentStatus,
                        customerContact: customerContact,
                        customerAddress: customerAddress
                    }
                );
            } catch (emailError) {
                console.error('Error sending subscription confirmation email:', emailError);
                
            }
        }


        res.status(201).json({ message: 'Subscription created successfully!', subscription: savedSubscription });

    }   

     catch (error) {
        console.error('Catch-all Error creating Stripe subscription:', error);
        let errorMessage = 'Failed to create Stripe subscription. Please try again.';
        if (error.type === 'StripeCardError') {
            errorMessage = error.message;
        } else if (error.type === 'StripeInvalidRequestError') {
            errorMessage = error.message;
        } else if (error.type === 'StripeAPIError') {
            errorMessage = `Stripe API Error: ${error.message}`;
        } else if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
            errorMessage = `Database validation error: ${validationErrors}`;
            console.error('Mongoose Validation Errors:', error.errors);
        }
        res.status(500).json({
            message: errorMessage,
            error: error.message,
            stripeError: error.raw || null
        });
    }
};

export const confirmSubscriptionPayment = async (req, res) => {
    const { paymentIntentId, stripeSubscriptionId } = req.body;
    const userId = req.user.id; // Get userId from auth middleware

    console.log('Request to confirm payment:', { paymentIntentId, stripeSubscriptionId, userId });

    if (!paymentIntentId || !stripeSubscriptionId || !userId) {
        return res.status(400).json({ message: 'Missing paymentIntentId or stripeSubscriptionId for confirmation.' });
    }

    try {
        // 1. Retrieve the Payment Intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // 2. Verify Payment Intent status
        if (paymentIntent.status === 'succeeded') {
            // Payment was successful on Stripe's side
            // 3. Find the local subscription and update its status
            const updatedSubscription = await Subscription.findOneAndUpdate(
                { user: userId, stripeSubscriptionId: stripeSubscriptionId }, // Find by user and Stripe Subscription ID
                { paymentStatus: 'active', status: 'active' }, // Set paymentStatus and status to active
                { new: true } // Return the updated document
            );

            if (!updatedSubscription) {
                console.warn(`Subscription with Stripe ID ${stripeSubscriptionId} not found for user ${userId} during confirmation.`);
                return res.status(404).json({ message: 'Matching subscription not found in your database.' });
            }

            try {
                await sendSubscriptionConfirmationEmail(
                    paymentIntent.receipt_email || user.email, // Use receipt_email from PI if available, else user's email
                    {
                        customerName: updatedSubscription.customerName, // From updated subscription
                        planType: updatedSubscription.planType,
                        startDate: updatedSubscription.startDate,
                        endDate: updatedSubscription.endDate,
                        paymentStatus: updatedSubscription.paymentStatus,
                        customerContact: updatedSubscription.customerContact,
                        customerAddress: updatedSubscription.customerAddress
                    }
                );
            } catch (emailError) {
                console.error('Error sending subscription confirmation email after payment confirmation:', emailError);
            }

            res.status(200).json({
                message: 'Payment confirmed and subscription activated successfully!',
                subscription: updatedSubscription,
                paymentIntentStatus: paymentIntent.status
            });

        } else {
            // Payment not succeeded, e.g., 'requires_payment_method', 'canceled', etc.
            console.error(`PaymentIntent ${paymentIntentId} status is ${paymentIntent.status} during confirmation.`);
            // You might update the local subscription status to 'failed' or 'pending' here
            const updatedSubscription = await Subscription.findOneAndUpdate(
                { user: userId, stripeSubscriptionId: stripeSubscriptionId },
                { paymentStatus: 'failed', status: 'failed' }, // Mark as failed in your DB
                { new: true }
            );
            return res.status(400).json({
                message: `Payment failed or incomplete: ${paymentIntent.status}.`,
                paymentIntentStatus: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Error in confirmSubscriptionPayment:', error);
        let errorMessage = 'Failed to confirm subscription payment.';
        if (error.type === 'StripeInvalidRequestError' || error.type === 'StripeAPIError') {
             errorMessage = `Stripe Error: ${error.message}`;
        }
        res.status(500).json({
            message: errorMessage,
            error: error.message
        });
    }
};


// Function to get a subscription by ID
export const getSubscriptionById = async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        const subscription = await Subscription.findById(subscriptionId).populate('user', 'firstName lastName email');
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
        const userId = req.params.userId; // Matches the router param name
        const subscriptions = await Subscription.find({ user: userId }).populate('user', 'firstName lastName email');
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

        // Prevent direct updates to core Stripe fields or immutable fields from your API
        // Any status changes should ideally go through a Stripe API call
        if (updates.billingCycle || updates.paymentMethod || updates.stripeSubscriptionId || updates.stripeCustomerId || updates.startDate || updates.endDate) {
            return res.status(400).json({ message: 'Cannot directly update certain subscription fields. Use Stripe API for core changes.' });
        }

        // If you want to allow changing 'notes' or 'customerAddress' etc.
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

// Function to delete a subscription (from your DB).
// IMPORTANT: If you delete from your DB, you should also cancel it in Stripe!
// This requires a Stripe API call, which is not in this function.
// For now, this just deletes from your DB.
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


export const getAllSubscriptions = async (req, res) => {
    try {

        const allSubscriptions = await Subscription.find({
            //  status: { $in: ['active', 'trialing', 'incomplete', 'canceled', 'past_due', 'unpaid'] } // Include all possible statuses or remove this line to fetch all
        }).populate('user', 'firstName lastName email'); // Populate user details as before

        
        res.status(200).json(allSubscriptions);
    } catch (error) {
        console.error('Error getting all subscriptions (admin view):', error);
        res.status(500).json({ message: 'Failed to get subscriptions for admin view.', error: error.message });
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