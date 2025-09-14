// src/config/postgres_connection.ts (Replace existing file)
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
  
  // Connection pool settings optimized for Neon
  max: 10, // Maximum number of clients in the pool
  min: 2,  // Minimum number of clients in the pool
  connectionTimeoutMillis: 10000, // 10 seconds connection timeout
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  query_timeout: 30000, // 30 seconds query timeout
  
  // Important for Neon: Enable keep alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // Application name for monitoring
  application_name: 'job_tracker_app',
});

// Handle pool errors
pool.on('error', (err: Error, client: PoolClient) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Pool has ended');
    process.exit(0);
  });
});

export default pool;