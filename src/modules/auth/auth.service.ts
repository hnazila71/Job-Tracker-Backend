// src/modules/auth/auth.service.ts - Complete Fixed Version
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';

// Global cache untuk user dan password yang sudah tervalidasi
interface CachedUser {
  user: User;
  validatedPassword: string; // Store the plain password that was validated
  timestamp: number;
}

const userCache = new Map<string, CachedUser>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 menit

export class AuthService {
  private userRepository = new UserRepository();
  
  async validateUser(email: string, pass: string): Promise<User | null> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cached = userCache.get(email);
      
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log(`Using cached user: 0ms`);
        
        // Skip bcrypt entirely - just compare plain passwords
        if (pass === cached.validatedPassword) {
          console.log(`Password matched from cache: 0ms`);
          return cached.user;
        } else {
          console.log(`Password mismatch from cache`);
          return null;
        }
      }

      // If not in cache, fetch from database
      console.log(`Cache miss, fetching from DB...`);
      const dbStart = Date.now();
      const user = await this.userRepository.findByEmail(email);
      console.log(`DB query took: ${Date.now() - dbStart}ms`);
      
      if (!user) {
        return null;
      }

      const hashStart = Date.now();
      const isPasswordMatch = await bcrypt.compare(pass, user.password_hash);
      console.log(`Password comparison took: ${Date.now() - hashStart}ms`);
      
      if (!isPasswordMatch) {
        return null;
      }

      // Cache the successful login with plain password
      userCache.set(email, {
        user: user,
        validatedPassword: pass, // Store plain password for instant comparison
        timestamp: Date.now()
      });
      
      console.log(`User cached for future logins`);
      return user;
      
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  generateToken(user: User): string {
    const payload = { 
      id: user.id, 
      email: user.email,
      name: user.name 
    };

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: '24h',
      algorithm: 'HS256'
    });
  }

  // Clear cache method
  clearCache(): void {
    userCache.clear();
    console.log('Auth cache cleared');
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: userCache.size,
      users: Array.from(userCache.keys())
    };
  }
}