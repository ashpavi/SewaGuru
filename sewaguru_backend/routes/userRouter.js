import express from "express";
import { adminOnly } from '../middleware/adminOnly.js';
import { authenticate } from '../middleware/auth.js';
import { login, register, refreshToken, createAdmin, logout } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', register);
router.post('/create-admin', authenticate, adminOnly, createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router; 