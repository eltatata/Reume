import { UserEntity, UserRole } from '../../../../src/domain/';
import { MockUserDatasource } from './mock-user.datasource';

describe('UserDatasource', () => {
  let datasource: MockUserDatasource;

  beforeEach(() => {
    datasource = new MockUserDatasource();
    datasource.resetUsers();
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
      const newUser = new UserEntity(
        '2',
        'Jane',
        'Doe',
        'jane.doe@example.com',
        UserRole.USER,
        true,
        new Date(),
        '+1234567890',
      );

      const createdUser = await datasource.create(newUser);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBe('2');
      expect(createdUser.email).toBe('jane.doe@example.com');

      const allUsers = await datasource.findAll();
      expect(allUsers).toHaveLength(2);
    });
  });

  describe('update', () => {
    test('should update an existing user successfully', async () => {
      const updatedUser = new UserEntity(
        '1',
        'John',
        'Doe',
        'john.doe@example.com',
        UserRole.ADMIN,
        true,
        new Date(),
        '+1234567890',
      );

      const result = await datasource.update('1', updatedUser);

      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
      expect(result?.role).toBe(UserRole.ADMIN);
    });

    test('should return null when updating a non-existent user', async () => {
      const updatedUser = new UserEntity(
        '999',
        'Non',
        'Existent',
        'non.existent@example.com',
        UserRole.USER,
        true,
        new Date(),
        '+1234567890',
      );

      const result = await datasource.update('999', updatedUser);

      expect(result).toBeNull();
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
});
