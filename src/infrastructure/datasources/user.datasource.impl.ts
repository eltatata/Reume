import { prisma } from '../../data/prisma.connection';
import {
  UserEntity,
  UserWithSchedulesEntity,
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
      where: { id },
      include: {
        schedules: true,
      },
    });

    if (!user) return null;

    return UserWithSchedulesEntity.toEntity({
      ...user,
      schedulesCount: user.schedules.length,
    });
  }

  async findAll(): Promise<UserWithSchedulesEntity[]> {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            schedules: true,
          },
        },
      },
    });

    return users.map((user) => {
      return UserWithSchedulesEntity.toEntity({
        ...user,
        schedulesCount: user._count.schedules,
      });
    });
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
