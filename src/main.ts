// src/main.ts

import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors'; // <-- 1. Impor cors

import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import trackerRoutes from './modules/tracker/tracker.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // <-- 2. Gunakan cors (letakkan sebelum rute)
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