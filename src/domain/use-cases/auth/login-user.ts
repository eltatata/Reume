import { bcryptAdapter, JwtAdapter, loggerAdapter } from '../../../config';
import {
  CustomError,
  LoginUserDto,
  LoginUserUseCase,
  LoginUserUseCaseResponse,
  UserRepository,
} from '../..';

const logger = loggerAdapter('LoginUserUseCase');

export class LoginUser implements LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(loginUserDto: LoginUserDto): Promise<LoginUserUseCaseResponse> {
    logger.log(`Starting user login process for: ${loginUserDto.email}`);

    const user = await this.userRepository.findByEmail(loginUserDto.email);
    if (!user) throw CustomError.notFound('User not found');
    if (!user.verified) throw CustomError.forbidden('User is not verified');

    const isPasswordValid = bcryptAdapter.compare(
      loginUserDto.password,
      user.password!,
    );
    if (!isPasswordValid) throw CustomError.unauthorized('Invalid password');

    const token = await JwtAdapter.generateToken({
      id: user.id,
      role: user.role,
    });
    if (!token) throw CustomError.internalServer('Failed to generate token');
    logger.log(`Token generated for ${user.email}, login successful`);

    delete user.password;

    return { token, user };
  }
}
