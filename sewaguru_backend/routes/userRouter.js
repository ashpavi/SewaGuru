import express from "express";
import { test } from '../controllers/test.js';
import { createAdmin, getAll, getLoggedInUser, login, logout, refreshToken, register, toggleUserStatus, updateUser, upgradeToProvider } from "../controllers/userController.js";
import { adminOnly, customerOnly } from '../middleware/accessLevel.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from "../middleware/fileHandler.js";

const router = express.Router();

router.get('/test', test)

router.get('/', authenticate, getLoggedInUser);
router.get('/all/:role', authenticate, adminOnly, getAll);
router.post('/create-admin', authenticate, adminOnly, createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.patch('/status/:status/:userId', authenticate, adminOnly, toggleUserStatus);

router.post('/register', upload.fields([
  { name: 'nicImages', maxCount: 2 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'gsCerts', maxCount: 1 },
  { name: 'policeCerts', maxCount: 1 },
  { name: 'extraCerts' },
]), register);

router.put('/update', authenticate, upload.fields([
  { name: 'nicImages', maxCount: 2 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'gsCerts', maxCount: 1 },
  { name: 'policeCerts', maxCount: 1 },
  { name: 'extraCerts' },
]), updateUser);

router.post('/upgrade',
  authenticate,
  customerOnly,
  upload.fields([
    { name: 'nicImages', maxCount: 2 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'gsCerts', maxCount: 1 },
    { name: 'policeCerts', maxCount: 1 },
    { name: 'extraCerts' },
  ]),
  upgradeToProvider
);

export default router; 