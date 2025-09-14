import pool from '../../config/postgres_connection';
import { User } from './user.entity';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  // Method baru untuk mencari berdasarkan Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE google_id = $1 LIMIT 1', [googleId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  // Method create diperbarui untuk menangani pengguna Google
  async create(user: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<User> {
    const client = await pool.connect();
    try {
      const { name, email, password_hash, google_id } = user;
      const result = await client.query(
        'INSERT INTO users (name, email, password_hash, google_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password_hash || null, google_id || null]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
    } finally {
      client.release();
    }
  }
}

