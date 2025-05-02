import express from "express";
import { createAdmin, login, logout, refreshToken, register, upgradeToProvider, getLoggedInUser, updateUser } from "../controllers/userController.js";
import { adminOnly, customerOnly } from '../middleware/accessLevel.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from "../middleware/fileHandler.js";
import {test} from '../controllers/test.js';

const router = express.Router();

router.get('/test', test)

router.get('/', authenticate, getLoggedInUser);

router.post('/register',upload.fields([
  { name: 'nicImages', maxCount: 2 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'gsCerts', maxCount: 1 },
  { name: 'policeCerts', maxCount: 1 },
  { name: 'extraCerts' },
]), register);

router.post('/create-admin', authenticate, adminOnly, createAdmin);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.put('/update', authenticate,upload.fields([
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