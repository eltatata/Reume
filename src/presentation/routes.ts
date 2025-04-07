import { Router } from 'express';
import { AuthRoutes, OtpRoutes } from './';

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/otp', OtpRoutes.routes);

    router.get('/api/health', (req, res) => {
      res.json({ status: 'The API is healthy' });
    });

    return router;
  }
}
