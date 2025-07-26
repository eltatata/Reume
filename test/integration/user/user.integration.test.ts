import request from 'supertest';
import { Server, AppRoutes } from '../../../src/presentation';
import { prisma } from '../../../src/data/prisma.connection';
import { User } from '../../../generated/prisma';

describe('User Integration Tests', () => {
  let server: Server;
  let adminUser: User;
  let regularUser: User;
  let accessToken: string;
  const PORT = 3005;

  beforeAll(async () => {
    server = new Server({
      port: PORT,
      routes: AppRoutes.routes,
    });

    server.start();

    await prisma.user.deleteMany();

    // Create admin user
    adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password:
          '$2a$10$P37bZmKAbf86iwhd/z5DEOui7h4WYWgy74RIqL59tJ5HDs8sG5uaO',
        role: 'ADMIN',
        phone: '+1234567890',
        verified: true,
      },
    });

    // Create regular user
    regularUser = await prisma.user.create({
      data: {
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@example.com',
        password:
          '$2a$10$P37bZmKAbf86iwhd/z5DEOui7h4WYWgy74RIqL59tJ5HDs8sG5uaO',
        role: 'USER',
        phone: '+1234567891',
        verified: true,
      },
    });

    // Login admin user
    const loginResponse = await request(server.app)
      .post('/api/auth/login')
      .send({
        email: adminUser.email,
        password: 'mySecurePassword123!',
      });
    accessToken = loginResponse.body.token;
  });

  afterAll(async () => {
    server.close();

    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/user', () => {
    test('should get all users', async () => {
      const response = await request(server.app)
        .get('/api/user')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            role: expect.any(String),
            verified: expect.any(Boolean),
          }),
        ]),
      );
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/user/:id', () => {
    test('should get specific user', async () => {
      const response = await request(server.app)
        .get(`/api/user/${regularUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: regularUser.id,
          firstName: regularUser.firstName,
          lastName: regularUser.lastName,
          email: regularUser.email,
          role: regularUser.role,
          verified: regularUser.verified,
        }),
      );
    });
  });
});
