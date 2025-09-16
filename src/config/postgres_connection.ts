// src/config/postgres_connection.ts (File yang Diperbaiki)
import { Pool, PoolClient } from 'pg';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // Optimasi khusus untuk Neon Database
  ssl: {
    rejectUnauthorized: false,
  },
  
  // Pengaturan connection pool yang dioptimalkan untuk Neon
  max: 10, // Jumlah maksimum klien di dalam pool
  min: 2,  // Jumlah minimum klien di dalam pool
  connectionTimeoutMillis: 10000, // Waktu tunggu koneksi 10 detik
  idleTimeoutMillis: 30000, // Waktu tunggu idle 30 detik
  query_timeout: 30000, // Waktu tunggu query 30 detik
  
  // Penting untuk Neon: Aktifkan keep alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // Nama aplikasi untuk pemantauan
  application_name: 'job_tracker_app',
});

// Menangani error pada pool
pool.on('error', (err: Error, client: PoolClient) => {
  console.error('Unexpected error on idle client', err);
  // JANGAN hentikan proses. Cukup catat errornya.
  // Pool akan menangani pembuangan klien yang rusak.
});

// Penutupan yang anggun (Graceful shutdown)
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Pool has ended');
    process.exit(0);
  });
});

export default pool;