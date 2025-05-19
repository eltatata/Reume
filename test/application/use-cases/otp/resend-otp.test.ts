import { ResendOtpDto, CustomError } from '../../../../src/domain';
import { ResendOtp } from '../../../../src/application';
import {
  MockUserRepository,
  MockUserDatasource,
  MockOtpRepository,
  MockOtpDatasource,
  MockEmailService,
} from '../../../mocks';

describe('ResendOtp', () => {
  jest.clearAllMocks();

  let resendOtp: ResendOtp;

  let emailService: MockEmailService;

  let otpRepository: MockOtpRepository;
  let otpDatasource: MockOtpDatasource;

  let userRepository: MockUserRepository;
  let userDatasource: MockUserDatasource;

  beforeEach(() => {
    emailService = new MockEmailService();

    otpDatasource = new MockOtpDatasource();
    otpRepository = new MockOtpRepository(otpDatasource);

    userDatasource = new MockUserDatasource();
    userRepository = new MockUserRepository(userDatasource);

    resendOtp = new ResendOtp(otpRepository, userRepository, emailService);

    jest.spyOn(resendOtp, 'execute');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should resend OTP successfully', async () => {
      userRepository.create({
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice.smith@example.com',
        password: 'password123',
        phone: '+1234567890',
      });

      const resendOtpDto: ResendOtpDto = {
        email: 'alice.smith@example.com',
      };

      expect(await resendOtp.execute(resendOtpDto)).toBeUndefined();
    });
  });

  test('should throw error if user is not found', async () => {
    const resendOtpDto: ResendOtpDto = {
      email: 'nonexistent@example.com',
    };

    await expect(resendOtp.execute(resendOtpDto)).rejects.toThrow(CustomError);
  });

  test('should throw error if user is already verified', async () => {
    const resendOtpDto: ResendOtpDto = {
      email: 'verified@example.com',
    };

    await expect(resendOtp.execute(resendOtpDto)).rejects.toThrow(CustomError);
  });

  test('should throw error if OTP request limit is exceeded', async () => {
    const resendOtpDto: ResendOtpDto = {
      email: 'limit@example.com',
    };

    await expect(resendOtp.execute(resendOtpDto)).rejects.toThrow(CustomError);
  });
});
