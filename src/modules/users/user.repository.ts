import pool from '../../config/postgres_connection';
import { User } from './user.entity';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      // Use prepared statements for better performance
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [email]
      );
      
      if (result.rows.length === 0) return null;

      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        password_hash: dbUser.password_hash,
        last_login_at: dbUser.last_login_at,
        created_at: dbUser.created_at,
      };
    } finally {
      client.release(); // Always release the client
    }
  }

  async create(user: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<User> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [user.name, user.email, user.password_hash]
      );
      
      const dbUser = result.rows[0];
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        password_hash: dbUser.password_hash,
        last_login_at: dbUser.last_login_at,
        created_at: dbUser.created_at,
      };
    } finally {
      client.release();
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [userId]
      );
    } finally {
      client.release();
    }
  }
}