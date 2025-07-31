import { loggerAdapter } from '../../../config';
import {
  CustomError,
  UserRole,
  UserRepository,
  DeleteUserUseCase,
} from '../../../domain';

const logger = loggerAdapter('DeleteUserUseCase');

export class DeleteUser implements DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, userId: string, role: UserRole): Promise<void> {
    logger.log(`Deleting user: ${id}`);

    if (id !== userId && role !== UserRole.ADMIN) {
      throw CustomError.forbidden(
        'You do not have permission to delete this user',
      );
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw CustomError.notFound('User not found');

    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) throw CustomError.internalServer('Error deleting user');

    logger.log(`User deleted successfully: ${id}`);
  }
}
