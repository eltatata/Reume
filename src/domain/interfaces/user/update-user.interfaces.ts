import { UpdateUserDto, UserEntity, UserRole } from '../..';

export interface UpdateUserUseCase {
  execute(
    id: string,
    userId: string,
    role: UserRole,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null>;
}
