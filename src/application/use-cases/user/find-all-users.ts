import { loggerAdapter } from '../../../config';
import {
  UserWithSchedulesEntity,
  UserRepository,
  FindAllUsersUseCase,
} from '../../../domain';

const logger = loggerAdapter('FindAllUsersUseCase');

export class FindAllUsers implements FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserWithSchedulesEntity[]> {
    logger.log(`Finding all users with schedules count`);
    const users = await this.userRepository.findAll();

    const usersWithoutPassword = users.map((user) => {
      delete user.password;
      return user;
    });

    return usersWithoutPassword;
  }
}
