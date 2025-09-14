// src/modules/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.entity';

// Augment the Request interface from Express to include the 'user' property.
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    req.user = user as User;
    next();
  });
};