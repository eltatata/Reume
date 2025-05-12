import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../domain';
import { jwtAdapter } from '../../config/';
import { prisma } from '../../data/prisma.connection';

export interface RequestExtended extends Request {
  user?: { id: string };
}

export class AuthMiddleware {
  static async validateJWT(
    req: RequestExtended,
    res: Response,
    next: NextFunction,
  ) {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    token = token.split('Bearer ').at(1);
    if (!token) return res.status(401).json({ message: 'Invalid token' });

    try {
      const payload = await jwtAdapter.verifyToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ message: 'Invalid token' });

      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (!user) return res.status(401).json({ message: 'Invalid token' });

      req.user = { id: user.id };

      next();
    } catch {
      throw CustomError.internalServer('Internal server error');
    }
  }
}
