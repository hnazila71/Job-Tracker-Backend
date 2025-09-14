import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { UserRepository } from '../modules/users/user.repository';
import 'dotenv/config';
import { User } from '../modules/users/user.entity';

const userRepo = new UserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL!,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
      try {
        let user = await userRepo.findByGoogleId(profile.id);
        if (user) {
          console.log('User ditemukan berdasarkan Google ID:', user.email);
          return done(null, user);
        }

        const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!userEmail) {
            return done(new Error("Tidak bisa mendapatkan email dari profil Google."), undefined);
        }

        user = await userRepo.findByEmail(userEmail);
        if (user) {
          console.error('Email sudah terdaftar dengan metode lain:', userEmail);
          return done(new Error("Email sudah terdaftar dengan metode lain."), undefined);
        }

        console.log('Membuat user baru untuk:', userEmail);
        const newUser = await userRepo.create({
          google_id: profile.id,
          name: profile.displayName,
          email: userEmail,
        });
        
        return done(null, newUser);

      } catch (error) {
        console.error("Error di dalam strategi Google Passport:", error);
        return done(error, undefined);
      }
    }
  )
);

