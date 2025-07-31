import { Router } from 'express';
import { AuthRoutes, OtpRoutes, ScheduleRoutes, UserRoutes } from './';

export class AppRoutes {
  static get routes() {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/otp', OtpRoutes.routes);
    router.use('/api/schedule', ScheduleRoutes.routes);
    router.use('/api/user', UserRoutes.routes);

    router.get('/api/health', (req, res) => {
      res.json({ status: 'The API is healthy' });
    });

    return router;
  }
}
