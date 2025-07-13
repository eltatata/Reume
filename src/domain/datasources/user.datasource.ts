import {
  UserEntity,
  UserWithSchedulesEntity,
  UpdateUserDto,
  RegisterUserDto,
} from '../';

export interface UserDatasource {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserWithSchedulesEntity[]>;
  create(registerUserDto: RegisterUserDto): Promise<UserEntity>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
