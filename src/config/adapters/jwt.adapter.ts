import { sign, verify } from 'jsonwebtoken';
import { envs } from './envs.adapter';

const JWT_SECRET = envs.JWT_SECRET;

export class JwtAdapter {
  static generateToken(payload: {
    [key: string]: unknown;
  }): Promise<string | null> {
    return new Promise((resolve) => {
      sign(payload, JWT_SECRET, { expiresIn: '2h' }, (err, token) => {
        if (err) return resolve(null);
        resolve(token!);
      });
    });
  }

  static verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
