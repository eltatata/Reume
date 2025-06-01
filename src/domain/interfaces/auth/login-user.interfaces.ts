import { UserEntity, LoginUserDto } from '../../';

export interface LoginUserUseCaseResponse {
  token?: string;
  user: Partial<UserEntity>;
}

export interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<LoginUserUseCaseResponse>;
}
