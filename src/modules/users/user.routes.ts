import { Router } from 'express';
import passport from 'passport';
import { login } from '../auth/auth.controller';
import { register, getProfile, setPassword } from '../users/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.entity';

const router = Router();
const authService = new AuthService();

router.post('/register', register);
router.post('/set-password', authMiddleware, setPassword);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/?error=google-login-failed` }),
  (req, res) => {
    const user = req.user as User;
    const token = authService.generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}`);
  }
);

export default router;

