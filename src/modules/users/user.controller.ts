// src/modules/users/user.controller.ts

import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../middleware/auth.middleware'; // Impor tipe baru
import { UserRepository } from './user.repository';

const userService = new UserService();
const userRepo = new UserRepository();

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }
  try {
    const newUser = await userService.createUser({ name, email, password_plain: password });
    const { password_hash, ...userResponse } = newUser;
    return res.status(201).json(userResponse);
  } catch (error: any) {
    if (error.message === 'Google account exists, set password') {
      return res.status(200).json({ requiresPassword: true, email });
    }
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    console.error('Error saat registrasi:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Endpoint ini protected — email diambil dari JWT, bukan dari request body
export const setPassword = async (req: AuthRequest, res: Response) => {
  const userFromToken = req.user;
  if (!userFromToken) return res.status(401).json({ message: 'Unauthorized' });

  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password wajib diisi' });
  if (password.length < 6) return res.status(400).json({ message: 'Password minimal 6 karakter' });

  try {
    await userService.setPasswordForGoogleUser(userFromToken.email, password);
    return res.status(200).json({ message: 'Password berhasil ditambahkan' });
  } catch (error: any) {
    if (error.message === 'User not found') return res.status(404).json({ message: 'User tidak ditemukan' });
    if (error.message === 'Not a Google account') return res.status(400).json({ message: 'Akun ini bukan akun Google' });
    if (error.message === 'Password already set') return res.status(409).json({ message: 'Password sudah pernah diset' });
    console.error('Error set password:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Fungsi baru untuk mendapatkan profil
export const getProfile = async (req: AuthRequest, res: Response) => {
  const userFromToken = req.user;
  if (!userFromToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Ambil data user lengkap dari database
  const user = await userRepo.findByEmail(userFromToken.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password_hash, ...userResponse } = user;
  return res.status(200).json({ ...userResponse, has_password: !!password_hash });
};