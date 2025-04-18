import { bcryptAdapter, otpAdapter } from '../../../config';
import {
  CustomError,
  RegisterUserDto,
  RegisterUserUseCase,
  UserEntity,
  UserRepository,
  EmailService,
  OtpRepository,
} from '../../';

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) throw CustomError.conflict('User already exists');

    const userWithHashedPassword = {
      ...registerUserDto,
      password: bcryptAdapter.hash(registerUserDto.password),
    };

    const user = await this.userRepository.create(userWithHashedPassword);

    const otp = otpAdapter.generate();
    const hashedOtp = bcryptAdapter.hash(otp);

    await this.otpRepository.create(user.id, hashedOtp);

    await this.emailService.sendVerificationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      otp,
    );

    return user;
  }
}
