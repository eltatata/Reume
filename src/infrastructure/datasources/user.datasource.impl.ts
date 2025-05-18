import { prisma } from '../../data/prisma.connection';
import {
  UserEntity,
  UserDatasource,
  RegisterUserDto,
  UpdateUserDto,
} from '../../domain';

export class UserDatasourceImpl implements UserDatasource {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? UserEntity.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user ? UserEntity.toEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => UserEntity.toEntity(user));
  }

  async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const newUser = await prisma.user.create({
      data: {
        firstName: registerUserDto.firstname,
        lastName: registerUserDto.lastname,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: 'USER',
        phone: registerUserDto.phone,
      },
    });
    return UserEntity.toEntity(newUser);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return updatedUser ? UserEntity.toEntity(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return true;
  }
}
