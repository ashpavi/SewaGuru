import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    customerName: {
        type: String
    },
    customerContact: { 
        type: String
    },
    customerAddress: {
        type: String
    },
    planType: {
        type: String,
        enum: ['Home Essentials Plan', 'Premium Care Plan'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        default: null
    },
    billingCycle: {
        type: String,
        default: 'monthly',
        immutable: true
    },
    nextBillingDate: {
        type: Date
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        default: 'online',
        immutable: true
    },
    transactionId: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Subscription', subscriptionSchema);