import { bcryptAdapter, loggerAdapter } from '../../../config';
import {
  CustomError,
  VerifyOtpDto,
  VerifyOtpUseCase,
  OtpRepository,
  UserRepository,
} from '../../';

const logger = loggerAdapter('VerifyOtpUseCase');

export class VerifyOtp implements VerifyOtpUseCase {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(verifyOtpDto: VerifyOtpDto): Promise<void> {
    logger.log(`Starting OTP verification process for: ${verifyOtpDto.userId}`);

    const otp = await this.otpRepository.findByUserId(verifyOtpDto.userId);
    if (!otp) throw CustomError.notFound('OTP not found');

    if (otp.used) throw CustomError.badRequest('OTP already used');
    if (otp.expiresAt < new Date()) {
      throw CustomError.badRequest('OTP expired');
    }

    const isOtpValid = bcryptAdapter.compare(verifyOtpDto.otp, otp.otp);
    if (!isOtpValid) throw CustomError.badRequest('Invalid OTP');

    await this.userRepository.update(verifyOtpDto.userId, {
      verified: true,
    });

    logger.log(`User verified successfully: ${verifyOtpDto.userId}`);

    await this.otpRepository.markAsUsed(otp.id);
  }
}
