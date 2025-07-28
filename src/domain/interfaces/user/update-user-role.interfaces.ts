import { UpdateUserDto, UserEntity } from '../..';

export interface UpdateUserRoleUseCase {
  execute(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null>;
}
