import request from 'supertest';
import { Server, AppRoutes } from '../../../src/presentation';

describe('Health Integration Tests', () => {
  let server: Server;
  const PORT = 3001;

  beforeAll(async () => {
    server = new Server({
      port: PORT,
      routes: AppRoutes.routes,
    });

    server.start();
  });

  afterAll(async () => {
    server.close();
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(server.app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'The API is healthy' });
    });
  });
});
