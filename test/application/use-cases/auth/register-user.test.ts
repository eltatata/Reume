import { UserRole, RegisterUserDto, CustomError } from '../../../../src/domain';
import { RegisterUser } from '../../../../src/application';

describe('RegisterUser', () => {
  const emailService = {
    sendVerificationEmail: jest.fn(),
    sendEmailVerificationLink: jest.fn(),
  };

  const otpRepository = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    markAsUsed: jest.fn(),
  };

  const userRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const registerUser = new RegisterUser(
    userRepository,
    otpRepository,
    emailService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user successfully', async () => {
    const newUserData = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com',
      password: 'mySecurePassword123!',
      role: UserRole.USER,
      verified: false,
      createdAt: new Date(),
      phone: '+1234567890',
    };

    const { validatedData } = RegisterUserDto.create(newUserData);

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'USER',
      verified: false,
      createdAt: '2024-03-30T12:00:00Z',
      phone: '+1234567890',
    });

    const createdUser = await registerUser.execute(validatedData!);

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.firstName).toBe('Jane');
    expect(createdUser.lastName).toBe('Doe');
    expect(createdUser.email).toBe('jane.doe@example.com');
    expect(createdUser.phone).toBe('+1234567890');
    expect(createdUser.role).toBe(UserRole.USER);
    expect(createdUser.password).toBeUndefined();
  });

  test('should throw an error when the user already exists', async () => {
    const newUserData = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const { validatedData } = RegisterUserDto.create(newUserData);

    userRepository.findByEmail.mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'USER',
      verified: false,
      createdAt: '2024-03-30T12:00:00Z',
      phone: '+1234567890',
    });

    await expect(registerUser.execute(validatedData!)).rejects.toThrow(
      CustomError.conflict('User already exists'),
    );
  });
});
