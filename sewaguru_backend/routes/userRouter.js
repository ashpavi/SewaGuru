import express from "express";
import { adminOnly, customerOnly } from '../middleware/access_level.js';
import { authenticate } from '../middleware/auth.js';
import { login, register, refreshToken, createAdmin, logout, upgradeToProvider } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', register);
router.post('/create-admin', authenticate, adminOnly, createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.post('/upgrade', authenticate, customerOnly, upgradeToProvider);

export default router; 