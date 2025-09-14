// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Menambahkan properti 'user' ke tipe Request Express
export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
  }

  if (!process.env.JWT_SECRET) {
    // Error ini penting untuk keamanan
    throw new Error('JWT_SECRET environment variable is not set');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    req.user = user;
    next(); // Lanjutkan ke controller jika token valid
  });
};