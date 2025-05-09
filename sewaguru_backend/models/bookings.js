import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  subService: {
    type: String
  },
  bookingDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  addressDetails: {
    type: String
  },
  urgency: {
    type: String,
    enum: ['Normal', 'Urgent'],
    default: 'Normal'
  },
    complexity: {
    type: String,
    enum: ['Simple', 'Moderate', 'Complex'],
    default: 'Simple'
    },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedAmount: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online']
  },
  imagesUploaded: {
    type: [String]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
