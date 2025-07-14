import {
  LoginUserDto,
  CustomError,
  UserRole,
  LoginUserUseCaseResponse,
} from '../../../../src/domain';
import { LoginUser } from '../../../../src/application';

describe('LoginUser', () => {
  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };
  const loginUser = new LoginUser(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should log in a user successfully', async () => {
    const loginUserData = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const { validatedData } = LoginUserDto.create(loginUserData);

    userRepository.findByEmail.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: '$2a$10$u8otbdIm0sWuTHCZIu7njO9hjSW4XR6mSCXI2LduOE8dWPEsKP3dm',
      phone: '+1234567890',
      role: UserRole.USER,
      verified: true,
    });

    const result = (await loginUser.execute(
      validatedData!,
    )) as LoginUserUseCaseResponse;

    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.id).toBeDefined();
    expect(result.user.firstName).toBe('John');
    expect(result.user.lastName).toBe('Doe');
    expect(result.user.email).toBe('john.doe@example.com');
    expect(result.user.phone).toBe('+1234567890');
    expect(result.user.role).toBe(UserRole.USER);
    expect(result.user.verified).toBe(true);
  });

  test('should throw an error if user is not found', async () => {
    const loginUserData = {
      email: 'non.existent@example.com',
      password: 'password123',
    };

    const { validatedData } = LoginUserDto.create(loginUserData);

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(loginUser.execute(validatedData!)).rejects.toThrow(
      CustomError.notFound('User not found'),
    );
  });

  test('should throw an error if password is invalid', async () => {
    const loginUserData = {
      email: 'john.doe@example.com',
      password: 'wrongpassword',
    };

    const { validatedData } = LoginUserDto.create(loginUserData);

    userRepository.findByEmail.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: '$2a$10$GM2sj.P6DdP3M10bMHwpfOG3ankX1gDa2vcRMZ5M3TwqSUnfPKOt.', // value: otherpassword
      phone: '+1234567890',
      role: UserRole.USER,
      verified: true,
    });

    await expect(loginUser.execute(validatedData!)).rejects.toThrow(
      CustomError.unauthorized('Invalid password'),
    );
  });
});
