import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class UserService {
  private readonly saltRounds = 10;
  private userRepository = new UserRepository();

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async createUser(userData: Pick<User, 'name' | 'email'> & { password_plain: string }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const password_hash = await this.hashPassword(userData.password_plain);

    return this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password_hash,
    });
  }
}