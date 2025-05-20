import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Make sure 'User' matches the name of your User model
      required: true,
      unique: true, // Assuming each user can have only one active subscription at a time
    },
    stripeCustomerId: { // This will store the ID of the customer object in Stripe (e.g., 'cus_...')
      type: String,
      required: true,
    },
    stripeSubscriptionId: { // This will store the ID of the subscription object in Stripe (e.g., 'sub_...')
      type: String,
      required: true,
      unique: true, // Each Stripe subscription ID is unique
    },
    planType: { // e.g., 'Home Essentials Plan', 'Premium Care Plan' - this comes from your frontend
      type: String,
      required: true,
      enum: ['Home Essentials Plan', 'Premium Care Plan'], // IMPORTANT: These must EXACTLY match your frontend values and Stripe Product names
    },
    startDate: { // The start date of the current billing period, from Stripe's `current_period_start`
      type: Date,
      required: true,
    },
    endDate: { // The end date of the current billing period, from Stripe's `current_period_end`
      type: Date,
      required: true,
    },
    paymentStatus: { // The current status of the subscription, mapped from Stripe's `status` (e.g., 'active', 'canceled', 'trialing')
      type: String,
      enum: ['pending', 'paid', 'failed', 'active', 'canceled', 'trialing', 'past_due', 'incomplete'],
      required: true,
    },
    paymentMethod: { // To explicitly denote it's a Stripe payment
      type: String,
      enum: ['online', 'stripe'],
      default: 'stripe',
    },
    // These fields are taken directly from the frontend submission for your admin panel's convenience
    customerName: {
        type: String,
        required: true
    },
    customerContact: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    notes: { // Keep this if you have a notes field for subscriptions
        type: String
    }
  },
  { timestamps: true } // Mongoose will automatically add `createdAt` and `updatedAt` fields
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;