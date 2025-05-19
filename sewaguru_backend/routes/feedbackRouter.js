import express from 'express';
import { getAllFeedback, submitFeedback } from '../controllers/feedbackController.js';
import { adminOnly } from '../middleware/accessLevel.js';
import { authenticate } from '../middleware/auth.js';



const router = express.Router();


router.post('/', submitFeedback);

router.get('/allFeedback', authenticate, adminOnly, getAllFeedback);

export default router;