import { loggerAdapter } from '../../../config';
import {
  CustomError,
  UpdateUserDto,
  UserEntity,
  UserRepository,
  UpdateUserRoleUseCase,
} from '../../../domain';

const logger = loggerAdapter('UpdateUserRoleUseCase');

export class UpdateUserRole implements UpdateUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    logger.log(`Updating user role: ${id}`);

    const { role: newRole } = updateUserDto;
    if (!newRole) throw CustomError.badRequest('Role is required');

    const user = await this.userRepository.findById(id);
    if (!user) throw CustomError.notFound('User not found');

    const updatedUser = await this.userRepository.update(id, {
      role: newRole,
    });

    logger.log(`User role updated successfully: ${id}`);

    const userWithoutPassword = { ...updatedUser! };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }
}
