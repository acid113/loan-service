import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock user data
const users = [{ id: '1', username: 'admin', passwordHash: bcrypt.hashSync('superpassword', 10) }];

const SECRET: jwt.Secret = process.env.JWT_SECRET || 'supersecretkey';
const EXPIRATION = process.env.JWT_EXPIRES_IN || '3600';

export class AuthService {
  async login(username: string, password: string) {
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, username }, SECRET, {
      expiresIn: Number(EXPIRATION),
    });

    return { token };
  }
}
