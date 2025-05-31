import request from 'supertest';
import { Server, AppRoutes } from '../../../src/presentation';
import { prisma } from '../../../src/data/prisma.connection';
import { User } from '../../../generated/prisma';
import { EmailServiceImpl } from '../../../src/infrastructure';

describe('OTP Integration Tests', () => {
  let server: Server;
  let user: User;
  let sendSpy: jest.SpyInstance;
  const PORT = 3003;

  beforeAll(async () => {
    sendSpy = jest
      .spyOn(EmailServiceImpl.prototype, 'sendVerificationEmail')
      .mockResolvedValue(undefined);

    server = new Server({
      port: PORT,
      routes: AppRoutes.routes,
    });

    server.start();

    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'mySecurePassword123!',
        role: 'USER',
        phone: '+1234567890',
      },
    });

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otp: '$2a$10$WfTX6mnf5Dog6BvWRabxTOt0ajcU4z83wNHB58VWCpHYqmXHeVbxG',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        used: false,
      },
    });
  });

  afterEach(async () => {
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: false },
    });
  });

  afterAll(async () => {
    sendSpy.mockRestore();

    server.close();

    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/otp/verify', () => {
    test('should verify OTP successfully', async () => {
      const validOtpData = {
        userId: user.id,
        otp: '123456',
      };

      const response = await request(server.app)
        .post('/api/otp/verify')
        .send(validOtpData);

      expect(response.status).toBe(200);
    });

    test('should return 400 if OTP is invalid', async () => {
      const invalidOtpData = {
        userId: user.id,
        otp: '12345',
      };

      const response = await request(server.app)
        .post('/api/otp/verify')
        .send(invalidOtpData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('should return 404 if OTP not found', async () => {
      const nonExistentUserId = '00000000-0000-4000-a000-000000000000';
      const invalidOtpData = {
        userId: nonExistentUserId,
        otp: '123456',
      };

      const response = await request(server.app)
        .post('/api/otp/verify')
        .send(invalidOtpData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'OTP not found' });
    });
  });

  describe('POST /api/otp/resend', () => {
    test('should return 400 if OTP resend is throttled', async () => {
      const validResendData = {
        email: 'jane.doe@example.com',
      };

      const response = await request(server.app)
        .post('/api/otp/resend')
        .send(validResendData);

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(
        'Please wait before requesting a new OTP',
      );
    });

    test('should resend OTP successfully', async () => {
      await prisma.otpVerification
        .findFirst({
          where: { userId: user.id },
        })
        .then(async (otp) => {
          if (otp) {
            await prisma.otpVerification.update({
              where: { id: otp.id },
              data: {
                createdAt: new Date(Date.now() - 61 * 1000),
                expiresAt: new Date(Date.now() - 60 * 1000),
              },
            });
          }
        });

      const validResendData = {
        email: user.email,
      };

      const response = await request(server.app)
        .post('/api/otp/resend')
        .send(validResendData);

      expect(response.status).toBe(200);
      expect(sendSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledWith(
        user.email,
        `${user.firstName} ${user.lastName}`,
        expect.any(String),
      );
    });

    test('should return 404 if user not found', async () => {
      const invalidResendData = {
        email: 'nonexistent@example.com',
      };

      const response = await request(server.app)
        .post('/api/otp/resend')
        .send(invalidResendData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    test('should return 400 if user already verified', async () => {
      await prisma.user.update({
        where: { id: user.id },
        data: { verified: true },
      });

      const validResendData = {
        email: user.email,
      };

      const response = await request(server.app)
        .post('/api/otp/resend')
        .send(validResendData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User already verified');
    });
  });
});
