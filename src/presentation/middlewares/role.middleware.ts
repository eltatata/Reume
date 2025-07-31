import { NextFunction, Response } from 'express';
import { UserRole } from '../../domain';
import { RequestExtended } from './auth.middleware';

export class RoleMiddleware {
  static validateRole(allowedRoles: UserRole[]) {
    return (req: RequestExtended, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    };
  }
}
