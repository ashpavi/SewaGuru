import Conversation from '../models/conversation.js';

export const getConversationsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversations = await Conversation
      .find({ members: userId })
      .populate('members', 'firstName lastName role') // <-- adjust fields as needed
      .sort({ lastUpdated: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getOrCreateConversation = async (req, res) => {
  const userId1 = req.user.id; // Admin
  const { userId2 } = req.body; // Provider

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [userId1, userId2], $size: 2 }
    });

    if (!conversation) {
      conversation = new Conversation({ members: [userId1, userId2] });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};