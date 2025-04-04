import { UserRepository, UserEntity, RegisterUserDto } from '../../src/domain/';
import { MockUserDatasource } from './mock-user.datasource';

export class MockUserRepository implements UserRepository {
  constructor(private readonly datasource: MockUserDatasource) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.datasource.findByEmail(email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.datasource.findById(id);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.datasource.findAll();
  }

  async create(user: RegisterUserDto): Promise<UserEntity> {
    return this.datasource.create(user);
  }

  update(): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    return this.datasource.delete(id);
  }
}
