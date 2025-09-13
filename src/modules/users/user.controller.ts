import { Request, Response } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }

  try {
    const newUser = await userService.createUser({
      name,
      email,
      password_plain: password,
    });
    
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