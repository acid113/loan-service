import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

interface AuthTokenResponse {
  token: string;
}

const users = [{ id: '1', username: 'admin', passwordHash: bcrypt.hashSync('superpassword', 10) }];

const SECRET: jwt.Secret = process.env.JWT_SECRET || 'supersecretkey';
const EXPIRATION = process.env.JWT_EXPIRES_IN || '3600';

@Injectable()
export class AuthService {
  async login(username: string, password: string): Promise<AuthTokenResponse> {
    const user = users.find((entry) => entry.username === username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, username }, SECRET, {
      expiresIn: Number(EXPIRATION),
    });

    return { token };
  }
}
