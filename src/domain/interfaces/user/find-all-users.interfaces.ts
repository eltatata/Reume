import { UserWithSchedulesEntity } from '../../';

export interface FindAllUsersUseCase {
  execute: () => Promise<UserWithSchedulesEntity[]>;
}
