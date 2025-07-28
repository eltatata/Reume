import { UpdateUserDto, UserRole } from '../..';

export interface RequestUpdateUserEmailUseCase {
  execute(
    id: string,
    userId: string,
    role: UserRole,
    updateUserDto: UpdateUserDto,
  ): Promise<void>;
}
