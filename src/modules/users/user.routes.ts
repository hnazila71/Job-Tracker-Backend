import { Router } from 'express';
import { register } from './user.controller';

const router = Router();

router.post('/register', register);

export default router;