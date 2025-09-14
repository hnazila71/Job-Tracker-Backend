// src/modules/users/user.routes.ts

import { Router } from 'express';
import { register, getProfile } from './user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);

// Rute ini sekarang dilindungi oleh authMiddleware
router.get('/profile', authMiddleware, getProfile);

export default router;