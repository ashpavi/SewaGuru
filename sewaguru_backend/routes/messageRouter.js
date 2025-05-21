import express from 'express';
import { createMessage, getMessagesByConversation } from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createMessage);
router.get('/:conversationId', authenticate, getMessagesByConversation);

export default router;
