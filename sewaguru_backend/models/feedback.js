import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  complainAgainst: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);
