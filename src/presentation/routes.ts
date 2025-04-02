import { Router } from 'express';
import { AuthRoutes } from './';

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);

    router.get('/api/health', (req, res) => {
      res.json({ status: 'The API is healthy' });
    });

    return router;
  }
}
