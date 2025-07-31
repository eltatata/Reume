import { UserEntity, UserRole } from '../..';

export interface FindOneUserUseCase {
  execute(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<UserEntity | null>;
}
