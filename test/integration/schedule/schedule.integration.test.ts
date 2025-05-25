import request from 'supertest';
import { Server, AppRoutes } from '../../../src/presentation';
import { prisma } from '../../../src/data/prisma.connection';
import { User } from '../../../generated/prisma';

describe('Schedule Integration Tests', () => {
  let server: Server;
  let user: User;
  let accessToken: string;
  const PORT = 3004;

  beforeAll(async () => {
    server = new Server({
      port: PORT,
      routes: AppRoutes.routes,
    });

    server.start();

    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password:
          '$2a$10$P37bZmKAbf86iwhd/z5DEOui7h4WYWgy74RIqL59tJ5HDs8sG5uaO',
        role: 'USER',
        phone: '+1234567890',
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });

    const response = await request(server.app).post('/api/auth/login').send({
      email: user.email,
      password: 'mySecurePassword123!',
    });
    accessToken = response.body.token;
  });

  afterAll(async () => {
    server.close();

    await prisma.schedule.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/schedule', () => {
    test('should create a schedule', async () => {
      const response = await request(server.app)
        .post('/api/schedule')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Schedule',
          description: 'This is a test schedule',
          startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
          endTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'Test Schedule',
          startTime: expect.any(String),
          endTime: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('GET /api/schedule', () => {
    test('should get all schedules', async () => {
      const response = await request(server.app)
        .get('/api/schedule')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Schedule',
            startTime: expect.any(String),
            endTime: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('PUT /api/schedule/:id', () => {
    test('should update a schedule', async () => {
      const schedule = await prisma.schedule.findFirst({
        where: { userId: user.id },
      });

      const response = await request(server.app)
        .put(`/api/schedule/${schedule?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Schedule',
          description: 'This is an updated test schedule',
          startTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
          endTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'Updated Schedule',
          startTime: expect.any(String),
          endTime: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('DELETE /api/schedule/:id', () => {
    test('should delete a schedule', async () => {
      const schedule = await prisma.schedule.findFirst({
        where: { userId: user.id },
      });

      const response = await request(server.app)
        .delete(`/api/schedule/${schedule?.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(204);
    });
  });
});
