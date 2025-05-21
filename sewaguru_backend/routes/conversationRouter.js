import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getConversationsByUser, getOrCreateConversation } from '../controllers/conversationController.js';

const router = express.Router();

router.get('/', authenticate, getConversationsByUser);
router.post('/create', authenticate, getOrCreateConversation); 

export default router;
