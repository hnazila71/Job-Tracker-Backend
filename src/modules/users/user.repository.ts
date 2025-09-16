// src/modules/users/user.repository.ts (File yang Diperbaiki dengan Logika Retry)
import pool from '../../config/postgres_connection';
import { User } from './user.entity';
import { PoolClient } from 'pg';

/**
 * Fungsi pembungkus (wrapper) untuk menjalankan query dengan logika retry.
 * Ini membantu menangani pemutusan koneksi sementara.
 * @param queryText Perintah SQL yang akan dieksekusi.
 * @param params Parameter untuk perintah SQL.
 * @param retries Jumlah percobaan ulang.
 * @returns Hasil query.
 */
async function queryWithRetry(queryText: string, params: any[], retries = 3) {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      const result = await client.query(queryText, params);
      return result; // Berhasil, kembalikan hasil
    } catch (err: any) {
      lastError = err;
      console.error(`Query failed on attempt ${i + 1}/${retries}:`, err.message);
      // Tunggu sebentar sebelum mencoba lagi untuk koneksi yang terputus
      if (err.message.includes('Connection terminated unexpectedly')) {
        await new Promise(res => setTimeout(res, 100)); // Tunggu 100ms
      } else {
        // Jika bukan error koneksi, langsung lemparkan
        if (client) client.release();
        throw err;
      }
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  // Jika semua percobaan gagal, lemparkan error terakhir
  throw lastError;
}


export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await queryWithRetry('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Method baru untuk mencari berdasarkan Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await queryWithRetry('SELECT * FROM users WHERE google_id = $1 LIMIT 1', [googleId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Method create diperbarui untuk menangani pengguna Google
  async create(user: Omit<User, 'id' | 'created_at' | 'last_login_at'>): Promise<User> {
    const { name, email, password_hash, google_id } = user;
    const result = await queryWithRetry(
      'INSERT INTO users (name, email, password_hash, google_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password_hash || null, google_id || null]
    );
    return result.rows[0];
  }

  async updateLastLogin(userId: string): Promise<void> {
    await queryWithRetry('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
  }
}