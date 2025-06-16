import request from 'supertest';
import { Server, AppRoutes } from '../../../src/presentation';
import { prisma } from '../../../src/data/prisma.connection';
import { User } from '../../../generated/prisma';

describe('Find Available Times Integration Tests', () => {
  let server: Server;
  let user: User;
  let accessToken: string;
  const PORT = 3005;

  beforeAll(async () => {
    server = new Server({
      port: PORT,
      routes: AppRoutes.routes,
    });

    server.start();

    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.available@example.com',
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

  beforeEach(async () => {
    await prisma.schedule.deleteMany();
  });

  describe('GET /api/schedule/available-times/:date', () => {
    test('should return all available times for a day with no schedules', async () => {
      const date = '2025-06-15';
      const response = await request(server.app)
        .get(`/api/schedule/available-times/${date}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('availableTimes');
      expect(response.body.availableTimes).toBeInstanceOf(Array);
      expect(response.body.availableTimes).toHaveLength(48); // 12 horas * 4 slots por hora
      expect(response.body.availableTimes[0]).toBe('06:00');
      expect(response.body.availableTimes[47]).toBe('17:45');
    });

    test('should exclude scheduled times from available times', async () => {
      const date = '2025-06-15';

      // Crear un agendamiento de 8:00 AM a 10:00 AM
      await prisma.schedule.create({
        data: {
          userId: user.id,
          title: 'Test Meeting',
          startTime: new Date('2025-06-15T08:00:00.000Z'),
          endTime: new Date('2025-06-15T10:00:00.000Z'),
        },
      });

      const response = await request(server.app)
        .get(`/api/schedule/available-times/${date}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('availableTimes');

      const availableTimes = response.body.availableTimes;

      // No debería incluir los slots ocupados entre 8:00 AM y 10:00 AM
      expect(availableTimes).not.toContain('08:00');
      expect(availableTimes).not.toContain('08:15');
      expect(availableTimes).not.toContain('09:45');

      // Debería incluir slots antes y después
      expect(availableTimes).toContain('07:45');
      expect(availableTimes).toContain('10:00');
    });

    test('should return error for invalid date format', async () => {
      const invalidDate = '2025/06/15';
      const response = await request(server.app)
        .get(`/api/schedule/available-times/${invalidDate}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid date format');
    });

    test('should return 401 for unauthorized access', async () => {
      const date = '2025-06-15';
      const response = await request(server.app).get(
        `/api/schedule/available-times/${date}`,
      );

      expect(response.status).toBe(401);
    });
  });
});
