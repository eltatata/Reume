import {
  bcryptAdapter,
  jwtAdapter,
  loggerAdapter,
  envs,
} from '../../../config';
import {
  CustomError,
  UpdateUserDto,
  UserRole,
  UserRepository,
  EmailService,
  RequestUpdateUserEmailUseCase,
} from '../../../domain';

const logger = loggerAdapter('RequestUpdateUserEmail');

export class RequestUpdateUserEmail implements RequestUpdateUserEmailUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(
    id: string,
    userId: string,
    role: UserRole,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    logger.log(`Requesting email update for user: ${id}`);

    if (id !== userId && role !== UserRole.ADMIN) {
      throw CustomError.forbidden(
        'You do not have permission to request an email update for this user',
      );
    }

    const { email, password } = updateUserDto;
    if (!email || !password) {
      throw CustomError.badRequest('Email and password are required');
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw CustomError.notFound('User not found');

    const isPasswordValid = bcryptAdapter.compare(password, user.password!);
    if (!isPasswordValid) throw CustomError.unauthorized('Invalid password');

    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists && emailExists.id !== id) {
      throw CustomError.conflict('Email already in use by another user');
    }

    const token = await jwtAdapter.generateToken({
      id: user.id,
      email: email,
    });
    if (!token) throw CustomError.internalServer('Failed to generate token');

    const verificationLink = `${envs.ORIGIN_URL}/verify-email?token=${token}`;
    await this.emailService.sendEmailVerificationLink(email, verificationLink);

    logger.log(
      `The email update request for user ${id} has been processed successfully.`,
    );
  }
}
