// src/main.ts

import express, { Request, Response } from 'express'; // <-- Perhatikan tambahan di sini
import 'dotenv/config';
import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Tipe untuk req dan res ditambahkan di sini
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});