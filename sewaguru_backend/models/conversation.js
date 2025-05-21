import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model('Conversation', ConversationSchema);
