import {
  UserEntity,
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

  findAll(): Promise<UserEntity[]> {
    return this.userDataSource.findAll();
  }

  create(user: RegisterUserDto): Promise<UserEntity> {
    return this.userDataSource.create(user);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
    return this.userDataSource.update(id, updateUserDto);
  }

  delete(id: string): Promise<boolean> {
    return this.userDataSource.delete(id);
  }
}
