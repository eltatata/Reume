import { LoginUserDto, CustomError, UserRole } from '../../../../src/domain';
import { LoginUser } from '../../../../src/application';
import { MockUserRepository, MockUserDatasource } from '../../../mocks';

describe('LoginUser', () => {
  let loginUser: LoginUser;

  let userRepository: MockUserRepository;
  let userDatasource: MockUserDatasource;

  beforeEach(() => {
    userDatasource = new MockUserDatasource();
    userRepository = new MockUserRepository(userDatasource);

    loginUser = new LoginUser(userRepository);
  });

  describe('execute', () => {
    test('should log in a user successfully', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const loggedInUser = await loginUser.execute(loginUserDto);

      expect(loggedInUser).toBeDefined();
      expect(loggedInUser.token).toBeDefined();
      expect(loggedInUser.user.id).toBeDefined();
      expect(loggedInUser.user.firstName).toBe('John');
      expect(loggedInUser.user.lastName).toBe('Doe');
      expect(loggedInUser.user.email).toBe('john.doe@example.com');
      expect(loggedInUser.user.phone).toBe('+1234567890');
      expect(loggedInUser.user.role).toBe(UserRole.USER);
      expect(loggedInUser.user.verified).toBe(true);
    });

    test('should throw an error if user is not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'non.existent@example.com',
        password: 'password123',
      };

      await expect(loginUser.execute(loginUserDto)).rejects.toThrow(
        CustomError.notFound('User not found'),
      );
    });

    test('should throw an error if password is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };

      await expect(loginUser.execute(loginUserDto)).rejects.toThrow(
        CustomError.unauthorized('Invalid password'),
      );
    });
  });
});
