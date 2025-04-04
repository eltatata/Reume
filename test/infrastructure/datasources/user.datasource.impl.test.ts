import { prisma } from '../../../src/data/prisma.connection';
import { UserDatasourceImpl } from '../../../src/infrastructure';
import { UserRole } from '../../../src/domain';

jest.mock('../../../src/data/prisma.connection', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

describe('UserDatasourceImpl', () => {
  let userDatasource: UserDatasourceImpl;
  const mockUser = {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    phone: '+1234567890',
    role: UserRole.USER,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userDatasource = new UserDatasourceImpl();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findByEmail', () => {
    test('should return a user when a valid email is provided', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userDatasource.findByEmail('john.doe@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toBeDefined();
      expect(result?.email).toBe('john.doe@example.com');
      expect(result?.firstName).toBe('John');
      expect(result?.lastName).toBe('Doe');
    });

    test('should return null when no user is found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userDatasource.findByEmail(
        'non.existent@example.com',
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'non.existent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    test('should create a user successfully', async () => {
      const userData = {
        email: 'jane.doe@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        password: 'password123',
        phone: '+1234567890',
      };
      (prisma.user.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...userData,
        firstName: userData.firstname,
        lastName: userData.lastname,
      });

      const result = await userDatasource.create(userData);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          firstName: userData.firstname,
          lastName: userData.lastname,
          password: userData.password,
          phone: userData.phone,
          role: 'USER',
        },
      });
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.firstName).toBe(userData.firstname);
      expect(result.lastName).toBe(userData.lastname);
    });

    test('should throw an error when creating a user with an existing email', async () => {
      const userData = {
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123',
        phone: '+1234567890',
      };
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error('Unique constraint failed on the fields: (`email`)'),
      );

      await expect(userDatasource.create(userData)).rejects.toThrow(
        'Unique constraint failed on the fields: (`email`)',
      );
    });
  });
});
