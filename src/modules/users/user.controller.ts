// src/modules/users/user.controller.ts

import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../middleware/auth.middleware'; // Impor tipe baru
import { UserRepository } from './user.repository';

const userService = new UserService();
const userRepo = new UserRepository();

export const register = async (req: Request, res: Response) => {
  // ... (kode registrasi yang sudah ada tetap sama)
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }
  try {
    const newUser = await userService.createUser({ name, email, password_plain: password });
    const { password_hash, ...userResponse } = newUser;
    return res.status(201).json(userResponse);
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    console.error('Error saat registrasi:', error);
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
  return res.status(200).json(userResponse);
};