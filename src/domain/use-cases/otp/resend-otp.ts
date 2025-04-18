import { bcryptAdapter, otpAdapter } from '../../../config';
import {
  CustomError,
  ResendOtpUseCase,
  OtpRepository,
  EmailService,
  UserRepository,
  ResendOtpDto,
} from '../../';

export class ResendOtp implements ResendOtpUseCase {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute({ email }: ResendOtpDto): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) throw CustomError.notFound('User not found');
    if (existingUser.verified)
      throw CustomError.badRequest('User already verified');

    const existingOtp = await this.otpRepository.findByUserId(existingUser.id);
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      throw CustomError.badRequest('OTP already sent');
    }

    const otp = otpAdapter.generate();
    const hashedOtp = bcryptAdapter.hash(otp);
    await this.otpRepository.create(existingUser.id, hashedOtp);

    await this.emailService.sendVerificationEmail(
      existingUser.email,
      `${existingUser.firstName} ${existingUser.lastName}`,
      otp,
    );
  }
}
