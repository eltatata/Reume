import { ResendOtpDto, CustomError } from '../../../../src/domain';
import { ResendOtp } from '../../../../src/application';

describe('ResendOtp', () => {
  const emailService = {
    sendVerificationEmail: jest.fn(),
    sendEmailVerificationLink: jest.fn(),
  };

  const otpRepository = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    markAsUsed: jest.fn(),
  };

  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const resendOtp = new ResendOtp(otpRepository, userRepository, emailService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should resend OTP successfully', async () => {
    const resendOtpData = {
      email: 'alice.smith@example.com',
    };

    const { validatedData } = ResendOtpDto.create(resendOtpData);

    userRepository.findByEmail.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      password: 'password123',
      phone: '+1234567890',
    });

    expect(await resendOtp.execute(validatedData!)).toBeUndefined();
  });

  test('should throw error if user is not found', async () => {
    const resendOtpData = {
      email: 'nonexistent@example.com',
    };

    const { validatedData } = ResendOtpDto.create(resendOtpData);

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(resendOtp.execute(validatedData!)).rejects.toThrow(
      CustomError.notFound('User not found'),
    );
  });

  test('should throw error if user is already verified', async () => {
    const resendOtpData = {
      email: 'verified@example.com',
    };

    const { validatedData } = ResendOtpDto.create(resendOtpData);

    userRepository.findByEmail.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'verified@example.com',
      password: 'password123',
      phone: '+1234567890',
      verified: true,
    });

    await expect(resendOtp.execute(validatedData!)).rejects.toThrow(
      CustomError.conflict('User already verified'),
    );
  });

  test('should throw error if OTP request limit is exceeded', async () => {
    const resendOtpData = {
      email: 'limit@example.com',
    };

    const { validatedData } = ResendOtpDto.create(resendOtpData);

    userRepository.findByEmail.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'limit@example.com',
      password: 'password123',
      phone: '+1234567890',
    });
    otpRepository.findByUserId.mockResolvedValue({
      id: 'otp-id',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      otp: 'hashed_otp',
      createdAt: new Date(Date.now() - 30 * 1000),
    });
    otpRepository.create.mockResolvedValue({
      id: 'new-otp-id',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      otp: 'new_hashed_otp',
      createdAt: new Date(),
    });

    await expect(resendOtp.execute(validatedData!)).rejects.toThrow(
      CustomError.tooManyRequests('Please wait before requesting a new OTP'),
    );
  });
});
