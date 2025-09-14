// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import passport from 'passport';
import { login } from './auth.controller';
import { AuthService } from './auth.service';

const router = Router();
const authService = new AuthService();

// Rute login standar
router.post('/login', login);

// Rute untuk memulai proses login Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rute callback setelah user login di Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}?error=google-login-failed` }),
  (req: any, res) => {
    // Jika berhasil, user akan ada di req.user
    const token = authService.generateToken(req.user);
    // Redirect ke frontend dengan membawa token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(req.user.name)}`);
  }
);

export default router;