import { loggerAdapter } from '../../../config';
import {
  CustomError,
  UpdateUserDto,
  UserEntity,
  UserRole,
  UserRepository,
  UpdateUserUseCase,
} from '../../../domain';

const logger = loggerAdapter('UpdateUserUseCase');

export class UpdateUser implements UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    userId: string,
    role: UserRole,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    logger.log(`Updating user: ${id}`);

    if (id !== userId && role !== UserRole.ADMIN) {
      throw CustomError.forbidden(
        'You do not have permission to update this user',
      );
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw CustomError.notFound('User not found');

    const { firstname, lastname, phone } = updateUserDto;
    const updatedUser = await this.userRepository.update(id, {
      firstname,
      lastname,
      phone,
    });

    logger.log(`User updated successfully: ${id}`);

    const userWithoutPassword = { ...updatedUser! };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }
}
