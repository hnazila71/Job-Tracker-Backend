import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';

import './config/passport-setup'; 

import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import trackerRoutes from './modules/tracker/tracker.routes';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3001',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};


app.use(cors(corsOptions));
app.use(express.json());

app.use(passport.initialize());

app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

