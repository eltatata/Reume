import { Router } from 'express';

export class AppRoutes {
  static get routes() {
    const router = Router();

    /**
     * @swagger
     * /api/health:
     *   get:
     *     summary: Verifies the health of the API.
     *     description: Verifies the health of the API.
     *     responses:
     *       200:
     *         description: API is healthy.
     */
    router.get('/api/health', (req, res) => {
      res.json({ status: 'The API is healthy' });
    });

    return router;
  }
}
