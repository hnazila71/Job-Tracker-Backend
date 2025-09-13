import bcrypt from 'bcrypt';
import { UserRepository } from '../users/user.repository';

export class AuthService {
  private userRepository = new UserRepository();

  async validateUser(email: string, pass: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return false;
    }

    return bcrypt.compare(pass, user.password_hash);
  }
}