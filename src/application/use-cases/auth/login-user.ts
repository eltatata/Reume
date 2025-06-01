import { bcryptAdapter, jwtAdapter, loggerAdapter } from '../../../config';
import {
  CustomError,
  LoginUserDto,
  LoginUserUnverifiedResponse,
  LoginUserUseCase,
  LoginUserUseCaseResponse,
  UserRepository,
} from '../../../domain';

const logger = loggerAdapter('LoginUserUseCase');

export class LoginUser implements LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    loginUserDto: LoginUserDto,
  ): Promise<LoginUserUseCaseResponse | LoginUserUnverifiedResponse> {
    logger.log(`Starting user login process for: ${loginUserDto.email}`);

    const user = await this.userRepository.findByEmail(loginUserDto.email);
    if (!user) throw CustomError.notFound('User not found');
    if (!user.verified) {
      logger.log(`User ${user.email} is not verified`);
      return { id: user.id, email: user.email };
    }
    const isPasswordValid = bcryptAdapter.compare(
      loginUserDto.password,
      user.password!,
    );
    if (!isPasswordValid) throw CustomError.unauthorized('Invalid password');

    const token = await jwtAdapter.generateToken({
      id: user.id,
      role: user.role,
    });
    if (!token) throw CustomError.internalServer('Failed to generate token');
    logger.log(`Token generated for ${user.email}, login successful`);

    delete user.password;

    return { token, user };
  }
}
