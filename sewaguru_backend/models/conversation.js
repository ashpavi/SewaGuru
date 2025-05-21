import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  members: [String], // user IDs
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model('Conversation', ConversationSchema);
