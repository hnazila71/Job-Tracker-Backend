import pool from '../../config/postgres_connection';
import { User } from './user.entity';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
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
  }

  async create(user: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<User> {
    const result = await pool.query(
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
  }
}