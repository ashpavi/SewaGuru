import Conversation from '../models/conversation.js';

export const getConversationsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversations = await Conversation//
      .find({ members: userId })
      .sort({ lastUpdated: -1 });

    res.json(conversations); // Send as an array directly
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};