import {
  UserEntity,
  UserWithSchedulesEntity,
  UserRepository,
  UserDatasource,
  RegisterUserDto,
  UpdateUserDto,
} from '../../domain';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDataSource: UserDatasource) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userDataSource.findByEmail(email);
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.userDataSource.findById(id);
  }

  findAll(): Promise<UserWithSchedulesEntity[]> {
    return this.userDataSource.findAll();
  }

  create(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.userDataSource.create(registerUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
    return this.userDataSource.update(id, updateUserDto);
  }

  delete(id: string): Promise<boolean> {
    return this.userDataSource.delete(id);
  }
}
