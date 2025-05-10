import { prisma } from '../../../src/data/prisma.connection';
import {
  UserRepositoryImpl,
  UserDatasourceImpl,
} from '../../../src/infrastructure';
import { UserEntity, UserRole } from '../../../src/domain';

jest.mock(
  '../../../src/infrastructure/datasources/user.datasource.impl',
  () => ({
    UserDatasourceImpl: jest.fn().mockImplementation(() => ({
      findByEmail: jest.fn(),
      create: jest.fn(),
    })),
  }),
);

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;
  let userDatasource: jest.Mocked<UserDatasourceImpl>;

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
  };

  beforeEach(() => {
    jest.clearAllMocks();

    userDatasource =
      new UserDatasourceImpl() as jest.Mocked<UserDatasourceImpl>;
    userRepository = new UserRepositoryImpl(userDatasource);
  });

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        phone: '+1234567890',
      },
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findByEmail', () => {
    test('should return a user when a valid email is provided', async () => {
      userDatasource.findByEmail.mockResolvedValue(
        UserEntity.toEntity(mockUser),
      );

      const result = await userRepository.findByEmail('john.doe@example.com');

      expect(userDatasource.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(result).toBeDefined();
      expect(result?.firstName).toBe('John');
      expect(result?.lastName).toBe('Doe');
      expect(result?.email).toBe('john.doe@example.com');
    });

    test('should return null when an invalid email is provided', async () => {
      userDatasource.findByEmail.mockResolvedValue(null);

      const result = await userRepository.findByEmail(
        'non.existent@example.com',
      );

      expect(userDatasource.findByEmail).toHaveBeenCalledWith(
        'non.existent@example.com',
      );
      expect(result).toBeNull();
    });

    test('should propagate errors from the datasource', async () => {
      const error = new Error('Database connection error');
      userDatasource.findByEmail.mockRejectedValue(error);

      await expect(
        userRepository.findByEmail('john.doe@example.com'),
      ).rejects.toThrow('Database connection error');
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
      const createdUser = {
        ...mockUser,
        ...userData,
        firstName: userData.firstname,
        lastName: userData.lastname,
      };
      userDatasource.create.mockResolvedValue(UserEntity.toEntity(createdUser));

      const result = await userRepository.create(userData);

      expect(userDatasource.create).toHaveBeenCalledWith(userData);
      expect(result).toBeDefined();
      expect(result?.email).toBe(userData.email);
      expect(result?.firstName).toBe(userData.firstname);
      expect(result?.lastName).toBe(userData.lastname);
    });

    test('should propagate errors from the datasource', async () => {
      const userData = {
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123',
        phone: '+1234567890',
      };
      const error = new Error(
        'Unique constraint failed on the fields: (`email`)',
      );
      userDatasource.create.mockRejectedValue(error);

      await expect(userRepository.create(userData)).rejects.toThrow(
        'Unique constraint failed on the fields: (`email`)',
      );
    });
  });
});
