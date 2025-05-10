import { UserEntity, LoginUserDto } from '../../';

export interface LoginUserUseCaseResponse {
  token: string;
  user: UserEntity;
}

export interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<LoginUserUseCaseResponse>;
}
