import request from 'supertest';
import { Server, AppRoutes } from '../../../src/presentation';
import { prisma } from '../../../src/data/prisma.connection';
import { User } from '../../../generated/prisma';

const toISOInTimeZone = (timeZone: string, hour: number, minute = 0) => {
  const { year, month, day } = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );

  return new Date(
    Date.UTC(+year, +month - 1, +day, hour, minute),
  ).toISOString();
};

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
      const timeZone = 'Europe/Paris';

      const response = await request(server.app)
        .post('/api/schedule')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Schedule',
          description: 'This is a test schedule',
          startTime: toISOInTimeZone(timeZone, 11),
          endTime: toISOInTimeZone(timeZone, 12),
          timeZone,
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

  describe('GET /api/schedule/available-times/:date', () => {
    test('should get available times for a specific date', async () => {
      const timeZone = 'Asia/Dubai';

      const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
        new Date(Date.now() + 1 * 86400000),
      );

      const response = await request(server.app)
        .get(`/api/schedule/available-times/${date}?timeZone=America/New_York`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.body.availableTimes).toHaveLength(96);
      expect(response.body.availableTimes[0]).toBe('00:00');
      expect(
        response.body.availableTimes[response.body.availableTimes.length - 1],
      ).toBe('23:45');
    });
  });

  describe('PUT /api/schedule/:id', () => {
    test('should update a schedule', async () => {
      const timeZone = 'America/Bogota';

      const schedule = await prisma.schedule.findFirst({
        where: { userId: user.id },
      });

      const response = await request(server.app)
        .put(`/api/schedule/${schedule?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Schedule',
          description: 'This is an updated test schedule',
          startTime: toISOInTimeZone(timeZone, 13),
          endTime: toISOInTimeZone(timeZone, 14),
          timeZone,
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
