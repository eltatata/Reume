import { bcryptAdapter, loggerAdapter, otpAdapter } from '../../../config';
import {
  CustomError,
  ResendOtpUseCase,
  OtpRepository,
  EmailService,
  UserRepository,
  ResendOtpDto,
} from '../../../domain';

const logger = loggerAdapter('ResendOtpUseCase');

export class ResendOtp implements ResendOtpUseCase {
  private readonly THROTTLE_WINDOW_MS = 60 * 1000;

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute({ email }: ResendOtpDto): Promise<void> {
    logger.log(`Starting OTP resend process for: ${email}`);

    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) throw CustomError.notFound('User not found');
    if (existingUser.verified)
      throw CustomError.badRequest('User already verified');

    const existingOtp = await this.otpRepository.findByUserId(existingUser.id);
    const lastSent = existingOtp?.createdAt;
    const now = new Date();

    if (
      lastSent &&
      now.getTime() - lastSent.getTime() < this.THROTTLE_WINDOW_MS
    ) {
      throw CustomError.badRequest('Please wait before requesting a new OTP');
    }

    const otp = otpAdapter.generate();
    const hashedOtp = bcryptAdapter.hash(otp);
    await this.otpRepository.create(existingUser.id, hashedOtp);
    logger.log(`OTP generated and stored for user: ${existingUser.id}`);

    await this.emailService.sendVerificationEmail(
      existingUser.email,
      `${existingUser.firstName} ${existingUser.lastName}`,
      otp,
    );
    logger.log(`Verification email sent to: ${existingUser.email}`);
  }
}
