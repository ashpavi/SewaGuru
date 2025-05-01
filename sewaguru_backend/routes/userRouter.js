import express from "express";
import { createAdmin, login, logout, refreshToken, register, upgradeToProvider, getLoggedInUser, updateUser } from "../controllers/userController.js";
import { adminOnly, customerOnly } from '../middleware/accessLevel.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from "../middleware/fileHandler.js";

const router = express.Router();

router.get('/', authenticate, getLoggedInUser);
router.post('/register', register);
router.post('/create-admin', authenticate, adminOnly, createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.put('/update', authenticate, updateUser);

router.post('/upgrade',
  authenticate,
  customerOnly,
  upload.fields([
    { name: 'nicImg', maxCount: 2 },
    { name: 'profileImg', maxCount: 1 },
    { name: 'gsCertImg', maxCount: 1 },
    { name: 'policeCertImg', maxCount: 1 },
    { name: 'otherImg' },
  ]),
  upgradeToProvider
);

export default router; 