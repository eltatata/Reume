import { UserRole, RegisterUserDto } from '../../../../src/domain';
import { MockUserDatasource } from '../../../mocks/mock-user.datasource';

describe('UserDatasource', () => {
  let datasource: MockUserDatasource;

  beforeEach(() => {
    datasource = new MockUserDatasource();
    datasource.resetUsers();
  });

  describe('findByEmail', () => {
    test('should return a user when a valid email is provided', async () => {
      const user = await datasource.findByEmail('john.doe@example.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe('john.doe@example.com');
      expect(user?.id).toBe('1');
    });

    test('should return null when an invalid email is provided', async () => {
      const user = await datasource.findByEmail('non.existent@example.com');

      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    test('should return a user when a valid id is provided', async () => {
      const user = await datasource.findById('1');

      expect(user).toBeDefined();
      expect(user?.id).toBe('1');
      expect(user?.email).toBe('john.doe@example.com');
    });

    test('should return null when an invalid id is provided', async () => {
      const user = await datasource.findById('999');

      expect(user).toBeNull();
    });
  });

  describe('findAll', () => {
    test('should return all users', async () => {
      const users = await datasource.findAll();

      expect(users).toBeDefined();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('1');
    });

    test('should return an empty array when no users exist', async () => {
      await datasource.delete('1');
      const users = await datasource.findAll();

      expect(users).toHaveLength(0);
    });
  });

  describe('create', () => {
    test('should create a new user successfully', async () => {
      const newUserDto: RegisterUserDto = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        phone: '+1234567890',
      };

      const createdUser = await datasource.create(newUserDto);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.firstName).toBe('Jane');
      expect(createdUser.lastName).toBe('Doe');
      expect(createdUser.email).toBe('jane.doe@example.com');
      expect(createdUser.role).toBe(UserRole.USER);
      expect(createdUser.phone).toBe('+1234567890');

      const allUsers = await datasource.findAll();
      expect(allUsers).toHaveLength(2);
    });
  });

  describe('delete', () => {
    test('should delete an existing user successfully', async () => {
      const result = await datasource.delete('1');

      expect(result).toBe(true);

      const deletedUser = await datasource.findById('1');
      expect(deletedUser).toBeNull();
    });

    test('should return false when deleting a non-existent user', async () => {
      const result = await datasource.delete('999');

      expect(result).toBe(false);
    });
  });
});
