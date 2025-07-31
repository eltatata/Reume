import { UserEntity, LoginUserDto } from '../../';

export interface LoginUserUseCaseResponse {
  token: string;
  user: UserEntity;
}

export interface LoginUserUnverifiedResponse {
  id: string;
  email: string;
}

export interface LoginUserUseCase {
  execute(
    loginUserDto: LoginUserDto,
  ): Promise<LoginUserUseCaseResponse | LoginUserUnverifiedResponse>;
}
