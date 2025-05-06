import { randomUUID } from 'crypto';
import {
  UserDatasource,
  UserEntity,
  UserRole,
  RegisterUserDto,
} from '../../../src/domain';

interface UserMock {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  verified: boolean;
  phone: string | undefined;
  createdAt: Date;
}

export class MockUserDatasource implements UserDatasource {
  private usersMock: UserMock[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: UserRole.USER,
      verified: true,
      phone: '+1234567890',
      createdAt: new Date(),
    },
  ];

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.usersMock.find((user) => user.email === email);
    return user ? UserEntity.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = this.usersMock.find((user) => user.id === id);
    return user ? UserEntity.toEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersMock.map((user) => UserEntity.toEntity(user));
  }

  async create(user: RegisterUserDto): Promise<UserEntity> {
    const newUser = {
      id: randomUUID(),
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      password: user.password,
      role: UserRole.USER,
      verified: false,
      phone: user.phone,
      createdAt: new Date(),
    };

    this.usersMock.push(newUser);
    return UserEntity.toEntity(newUser);
  }

  async update(id: string, user: RegisterUserDto): Promise<UserEntity | null> {
    const index = this.usersMock.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...this.usersMock[index],
      ...user,
      updatedAt: new Date(),
    };

    this.usersMock[index] = updatedUser;
    return UserEntity.toEntity(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.usersMock.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.usersMock.splice(index, 1);
    return true;
  }

  resetUsers(): void {
    this.usersMock = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: UserRole.USER,
        verified: true,
        phone: '+1234567890',
        createdAt: new Date(),
      },
    ];
  }
}
