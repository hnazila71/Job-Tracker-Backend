// src/main.ts

import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';

import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import trackerRoutes from './modules/tracker/tracker.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// --- KONFIGURASI CORS DINAMIS ---
const allowedOrigins = [
  'http://localhost:3001', // Izin untuk frontend lokal Anda
  process.env.FRONTEND_URL // Izin untuk frontend di Vercel (dari .env)
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Izinkan jika origin ada di dalam daftar atau jika origin tidak ada (seperti request dari Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// ---------------------------------

app.use(express.json());

// Routes
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});