import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class UserService {
  private readonly saltRounds = 6;
  private userRepository = new UserRepository();

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async createUser(userData: Pick<User, 'name' | 'email'> & { password_plain: string }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      if (existingUser.google_id && !existingUser.password_hash) {
        throw new Error('Google account exists, set password');
      }
      throw new Error('Email already exists');
    }

    const password_hash = await this.hashPassword(userData.password_plain);

    return this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password_hash,
    });
  }

  async setPasswordForGoogleUser(email: string, password_plain: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('User not found');
    if (!user.google_id) throw new Error('Not a Google account');
    if (user.password_hash) throw new Error('Password already set');

    const password_hash = await this.hashPassword(password_plain);
    await this.userRepository.updatePasswordHash(user.id, password_hash);
  }
}