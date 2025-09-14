// src/modules/auth/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const user = await authService.validateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Buat dan kirim token
    const token = authService.generateToken(user);
    return res.status(200).json({
      message: 'Login berhasil!',
      accessToken: token,
    });

  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};