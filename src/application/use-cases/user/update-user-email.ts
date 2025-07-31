import { jwtAdapter, loggerAdapter } from '../../../config';
import {
  CustomError,
  UserRepository,
  UpdateUserEmailUseCase,
} from '../../../domain';

const logger = loggerAdapter('UpdateUserEmail');

export class UpdateUserEmail implements UpdateUserEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(token: string): Promise<void> {
    logger.log(`Updating user email with token: ${token}`);

    const payload = await jwtAdapter.verifyToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid or expired token');

    const { id, email } = payload as { id: string; email: string };
    const updatedUser = await this.userRepository.update(id, { email });
    if (!updatedUser) throw CustomError.notFound('User not found');

    logger.log(`Email updated successfully for user: ${id}`);
  }
}
