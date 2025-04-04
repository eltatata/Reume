import { prisma } from '../../data/prisma.connection';
import { UserEntity, UserDatasource, RegisterUserDto } from '../../domain';

export class UserDatasourceImpl implements UserDatasource {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? UserEntity.toJSON(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user ? UserEntity.toJSON(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => UserEntity.toJSON(user));
  }

  async create(user: RegisterUserDto): Promise<UserEntity> {
    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        password: user.password,
        role: 'USER',
        phone: user.phone,
      },
    });
    return UserEntity.toJSON(newUser);
  }

  update(): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
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
