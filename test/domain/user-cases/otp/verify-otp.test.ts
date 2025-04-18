import { VerifyOtp, VerifyOtpDto, CustomError } from '../../../../src/domain';
import {
  MockUserRepository,
  MockUserDatasource,
  MockOtpRepository,
  MockOtpDatasource,
} from '../../../mocks';

describe('VerifyOtp', () => {
  jest.clearAllMocks();

  let verifyOtp: VerifyOtp;

  let otpRepository: MockOtpRepository;
  let otpDatasource: MockOtpDatasource;

  let userRepository: MockUserRepository;
  let userDatasource: MockUserDatasource;

  beforeEach(() => {
    otpDatasource = new MockOtpDatasource();
    otpRepository = new MockOtpRepository(otpDatasource);

    userDatasource = new MockUserDatasource();
    userRepository = new MockUserRepository(userDatasource);

    verifyOtp = new VerifyOtp(otpRepository, userRepository);

    jest.spyOn(otpRepository, 'markAsUsed');
    jest.spyOn(userRepository, 'update');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should verify OTP successfully', async () => {
      jest.spyOn(otpRepository, 'markAsUsed');
      jest.spyOn(userRepository, 'update');

      const verifyOtpDto: VerifyOtpDto = {
        userId: '1',
        otp: '123456',
      };

      await verifyOtp.execute(verifyOtpDto);

      expect(userRepository.update).toHaveBeenCalledWith(verifyOtpDto.userId, {
        verified: true,
      });
      expect(otpRepository.markAsUsed).toHaveBeenCalledWith(expect.any(String));
    });
  });

  test('should throw error if OTP is not found', async () => {
    const verifyOtpDto: VerifyOtpDto = {
      userId: 'non-existing-user',
      otp: '123456',
    };

    await expect(verifyOtp.execute(verifyOtpDto)).rejects.toThrow(CustomError);
  });

  test('should throw error if OTP is already used', async () => {
    const verifyOtpDto: VerifyOtpDto = {
      userId: '1',
      otp: '123456',
    };

    await verifyOtp.execute(verifyOtpDto);

    await expect(verifyOtp.execute(verifyOtpDto)).rejects.toThrow(
      CustomError.badRequest('OTP already used'),
    );
  });

  test('should throw error if OTP is invalid', async () => {
    const verifyOtpDto: VerifyOtpDto = {
      userId: '1',
      otp: 'invalid-otp',
    };

    await expect(verifyOtp.execute(verifyOtpDto)).rejects.toThrow(
      CustomError.badRequest('Invalid OTP'),
    );
  });
});
