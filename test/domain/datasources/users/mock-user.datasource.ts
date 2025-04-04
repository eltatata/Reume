import { UserDatasource, UserEntity, UserRole } from '../../../../src/domain/';

export class MockUserDatasource implements UserDatasource {
  private users: UserEntity[] = [
    new UserEntity(
      '1',
      'John',
      'Doe',
      'john.doe@example.com',
      UserRole.USER,
      true,
      new Date(),
      '+1234567890',
    ),
  ];

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }

  async update(id: string, user: UserEntity): Promise<UserEntity | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    this.users[index] = user;
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  resetUsers(): void {
    this.users = [
      new UserEntity(
        '1',
        'John',
        'Doe',
        'john.doe@example.com',
        UserRole.USER,
        true,
        new Date(),
        '+1234567890',
      ),
    ];
  }
}
