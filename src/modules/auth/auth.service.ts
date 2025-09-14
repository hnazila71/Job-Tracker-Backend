// src/modules/auth/auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';

export class AuthService {
  private userRepository = new UserRepository();

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null; // User tidak ditemukan
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isPasswordMatch) {
      return null; // Password tidak cocok
    }
    return user;
  }

  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email };

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}