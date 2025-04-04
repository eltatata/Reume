import { UserEntity, RegisterUserDto } from '../../';

export interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
