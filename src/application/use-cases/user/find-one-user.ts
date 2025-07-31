import { loggerAdapter } from '../../../config';
import {
  CustomError,
  UserEntity,
  UserRepository,
  FindOneUserUseCase,
  UserRole,
} from '../../../domain';

const logger = loggerAdapter('FindOneUserUseCase');

export class FindOneUser implements FindOneUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<UserEntity | null> {
    logger.log(`Finding user with id ${id}`);

    if (id !== userId && role !== UserRole.ADMIN) {
      throw CustomError.forbidden(
        'You do not have permission to access this user',
      );
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw CustomError.notFound('User not found');

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }
}
