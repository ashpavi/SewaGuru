// controllers/messageController.js
import Message from '../models/message.js';


export const createMessage = async (req, res) => {
  const { conversationId, content } = req.body;
  const senderId = req.user.id;

  try {
    // 1. Save message to DB
    const message = await Message.create({
      conversationId,
      senderId,
      text: content,
    });

    // 2. Populate sender field (fetch name from User model)
    const populatedMessage = await message.populate('senderId', 'name');

    // 3. Emit to socket
    const io = req.app.get('io');
    io.to(conversationId).emit('receive_message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessagesByConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'firstName lastName role')
      .sort({ createdAt: 1 }); // oldest to newest

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
