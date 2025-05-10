import { bcryptAdapter, otpAdapter, loggerAdapter } from '../../../config';
import {
  CustomError,
  RegisterUserDto,
  RegisterUserUseCase,
  UserEntity,
  UserRepository,
  EmailService,
  OtpRepository,
} from '../../';

const logger = loggerAdapter('RegisterUserUseCase');

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    logger.log(
      `Starting user registration process for: ${registerUserDto.email}`,
    );

    const existingUser = await this.userRepository.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) throw CustomError.conflict('User already exists');

    const userWithHashedPassword = {
      ...registerUserDto,
      password: bcryptAdapter.hash(registerUserDto.password),
    };

    const user = await this.userRepository.create(userWithHashedPassword);
    logger.log(`User created successfully: ${user.id} - ${user.email}`);

    const otp = otpAdapter.generate();
    const hashedOtp = bcryptAdapter.hash(otp);

    await this.otpRepository.create(user.id, hashedOtp);
    logger.log(`Otp generated and stored for user: ${user.id}`);

    await this.emailService.sendVerificationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      otp,
    );
    logger.log(`Verification email sent to: ${user.email}`);

    delete user.password;

    return user;
  }
}
