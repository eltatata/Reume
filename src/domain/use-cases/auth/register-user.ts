import { bcryptAdapter } from '../../../config';
import {
  RegisterUserDto,
  RegisterUserUseCase,
  UserEntity,
  UserRepository,
} from '../../';

export class RegisterUser implements RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) throw new Error('User already exists');

    const userWithHashedPassword = {
      ...registerUserDto,
      password: bcryptAdapter.hash(registerUserDto.password),
    };

    const user = await this.userRepository.create(userWithHashedPassword);

    return user;
  }
}
