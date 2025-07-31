import { VerifyOtpDto, CustomError } from '../../../../src/domain';
import { VerifyOtp } from '../../../../src/application';

describe('VerifyOtp', () => {
  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const otpRepository = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    markAsUsed: jest.fn(),
  };

  const verifyOtp = new VerifyOtp(otpRepository, userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should verify OTP successfully', async () => {
    const verifyOtpData = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      otp: '123456',
    };

    const { validatedData } = VerifyOtpDto.create(verifyOtpData);

    otpRepository.findByUserId.mockResolvedValue({
      id: 'otp-id',
      userId: '1',
      otp: '$2a$10$Umqf2XuNQTF3m3cghU1MRe/H36oPSSAdA5NPQpqZqrrB9mRlb/Okm',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
    });
    otpRepository.markAsUsed.mockResolvedValue(true);

    await verifyOtp.execute(validatedData!);

    expect(userRepository.update).toHaveBeenCalledWith(validatedData!.userId, {
      verified: true,
    });
    expect(otpRepository.markAsUsed).toHaveBeenCalledWith(expect.any(String));
  });

  test('should throw error if OTP is not found', async () => {
    const verifyOtpData = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      otp: '123456',
    };

    const { validatedData } = VerifyOtpDto.create(verifyOtpData);

    otpRepository.findByUserId.mockResolvedValue(null);

    await expect(verifyOtp.execute(validatedData!)).rejects.toThrow(
      CustomError,
    );
  });

  test('should throw error if OTP is already used', async () => {
    const verifyOtpDto: VerifyOtpDto = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      otp: '123456',
    };

    const { validatedData } = VerifyOtpDto.create(verifyOtpDto);

    otpRepository.findByUserId.mockResolvedValue({
      id: 'otp-id',
      userId: '1',
      otp: '$2a$10$fRKYVbY1kVjR1C/LEV/eB.EBr6V6IAvIwRGQDCp0xqpMRsROYVB3K',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      used: true,
    });

    await expect(verifyOtp.execute(validatedData!)).rejects.toThrow(
      CustomError.badRequest('OTP already used'),
    );
  });
});
