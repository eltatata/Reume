import request from 'supertest';
import { Server } from '../../../src/presentation/server';
import { AppRoutes } from '../../../src/presentation/routes';
import { prisma } from '../../../src/data/prisma.connection';
import { UserRole } from '../../../src/domain';

describe('Auth Integration Tests', () => {
  let server: Server;
  const PORT = 3002;

  beforeAll(async () => {
    server = new Server({
      port: PORT,
      routes: AppRoutes.routes,
    });

    server.start();

    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    server.close();

    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    test('should register a new user successfully', async () => {
      const response = await request(server.app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(validUserData.email);
      expect(response.body.firstName).toBe(validUserData.firstname);
      expect(response.body.lastName).toBe(validUserData.lastname);
      expect(response.body.role).toBe(UserRole.USER);
      expect(response.body.verified).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body.phone).toBe(validUserData.phone);
    });

    test('should return validation errors for invalid data', async () => {
      const invalidUserData = {
        firstname: '',
        lastname: 'Doe',
        email: 'invalid-email',
        password: '123',
        phone: '+1234567890',
      };

      const response = await request(server.app)
        .post('/api/auth/register')
        .send(invalidUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('should return conflict error when registering with an existing email', async () => {
      const response = await request(server.app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User already exists');
    });
  });
});
