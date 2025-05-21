import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getConversationsByUser } from '../controllers/conversationController.js';

const router = express.Router();

router.get('/', authenticate, getConversationsByUser);

export default router;
