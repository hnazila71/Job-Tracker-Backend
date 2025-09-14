import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  const overallStart = Date.now();
  const { email, password } = req.body;

  // Quick validation
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email dan password wajib diisi',
      processingTime: Date.now() - overallStart
    });
  }

  try {
    console.log(`Starting login for: ${email}`);
    
    const user = await authService.validateUser(email, password);

    if (!user) {
      return res.status(401).json({ 
        message: 'Email atau password salah',
        processingTime: Date.now() - overallStart
      });
    }

    // Generate token
    const tokenStart = Date.now();
    const token = authService.generateToken(user);
    console.log(`Token generation took: ${Date.now() - tokenStart}ms`);
    
    const totalTime = Date.now() - overallStart;
    console.log(`Total login time: ${totalTime}ms`);
    
    return res.status(200).json({
      message: 'Login berhasil!',
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      processingTime: totalTime
    });

  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({ 
      message: 'Terjadi kesalahan pada server',
      processingTime: Date.now() - overallStart
    });
  }
};