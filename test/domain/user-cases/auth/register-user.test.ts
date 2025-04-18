import {
  UserRole,
  RegisterUser,
  RegisterUserDto,
  CustomError,
} from '../../../../src/domain';
import {
  MockUserRepository,
  MockUserDatasource,
  MockOtpRepository,
  MockOtpDatasource,
  MockEmailService,
} from '../../../mocks';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;

  let emailService: MockEmailService;

  let otpRepository: MockOtpRepository;
  let otpDatasource: MockOtpDatasource;

  let userRepository: MockUserRepository;
  let userDatasource: MockUserDatasource;

  beforeEach(() => {
    emailService = new MockEmailService();

    otpDatasource = new MockOtpDatasource();
    otpRepository = new MockOtpRepository(otpDatasource);

    userDatasource = new MockUserDatasource();
    userRepository = new MockUserRepository(userDatasource);

    registerUser = new RegisterUser(
      userRepository,
      otpRepository,
      emailService,
    );
  });

  describe('execute', () => {
    test('should create a new user successfully', async () => {
      const newUserDto: RegisterUserDto = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        phone: '+1234567890',
      };

      const createdUser = await registerUser.execute(newUserDto);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.firstName).toBe('Jane');
      expect(createdUser.lastName).toBe('Doe');
      expect(createdUser.email).toBe('jane.doe@example.com');
      expect(createdUser.phone).toBe('+1234567890');
      expect(createdUser.role).toBe(UserRole.USER);
    });

    test('should throw an error when the user already exists', async () => {
      const newUserDto: RegisterUserDto = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        phone: '+1234567890',
      };

      await registerUser.execute(newUserDto);

      await expect(registerUser.execute(newUserDto)).rejects.toThrow(
        CustomError.conflict('User already exists'),
      );

      const allUsers = await userDatasource.findAll();

      expect(allUsers.length).toBe(2);
      expect(allUsers[1].email).toBe('jane.doe@example.com');
    });
  });
});
