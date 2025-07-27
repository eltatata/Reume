import { UpdateUserDto, UserRole } from '../../../../src/domain';

describe('UpdateUserDto', () => {
  test('should create a valid UpdateUserDto with all fields', () => {
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'mySecurePassword123!',
      role: UserRole.USER,
      verified: true,
      phone: '+1234567890',
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.firstname).toBe(data.firstname);
    expect(result?.validatedData?.lastname).toBe(data.lastname);
    expect(result?.validatedData?.email).toBe(data.email);
    expect(result?.validatedData?.password).toBe(data.password);
    expect(result?.validatedData?.role).toBe(data.role);
    expect(result?.validatedData?.verified).toBe(data.verified);
    expect(result?.validatedData?.phone).toBe(data.phone);
  });

  test('should create a valid UpdateUserDto with partial fields', () => {
    const data = {
      firstname: 'Jane',
      email: 'jane@example.com',
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.firstname).toBe(data.firstname);
    expect(result?.validatedData?.email).toBe(data.email);
    expect(result?.validatedData?.lastname).toBeUndefined();
    expect(result?.validatedData?.password).toBeUndefined();
    expect(result?.validatedData?.role).toBeUndefined();
    expect(result?.validatedData?.verified).toBeUndefined();
    expect(result?.validatedData?.phone).toBeUndefined();
  });

  test('should create a valid UpdateUserDto with empty object', () => {
    const data = {};

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
  });

  test('should return error for invalid email format', () => {
    const data = {
      email: 'invalid-email',
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid email format',
      }),
    );
  });

  test('should return error for invalid phone number format', () => {
    const data = {
      phone: '123',
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid phone number format',
      }),
    );
  });

  test('should return error for invalid role', () => {
    const data = {
      role: 'INVALID_ROLE' as UserRole,
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid role. Must be USER or ADMIN.',
      }),
    );
  });

  test('should accept valid USER role', () => {
    const data = {
      role: UserRole.USER,
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.role).toBe(UserRole.USER);
  });

  test('should accept valid ADMIN role', () => {
    const data = {
      role: UserRole.ADMIN,
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.role).toBe(UserRole.ADMIN);
  });

  test('should trim whitespace from string fields', () => {
    const data = {
      firstname: '  John  ',
      lastname: '  Doe  ',
      email: '  john@example.com  ',
      password: '  mySecurePassword123!  ',
      phone: '  +1234567890  ',
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.firstname).toBe('John');
    expect(result?.validatedData?.lastname).toBe('Doe');
    expect(result?.validatedData?.email).toBe('john@example.com');
    expect(result?.validatedData?.password).toBe('mySecurePassword123!');
    expect(result?.validatedData?.phone).toBe('+1234567890');
  });

  test('should return multiple errors for multiple invalid fields', () => {
    const data = {
      email: 'invalid-email',
      phone: '123',
      role: 'INVALID_ROLE' as UserRole,
    };

    const result = UpdateUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toHaveLength(3);
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid email format',
      }),
    );
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid phone number format',
      }),
    );
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid role. Must be USER or ADMIN.',
      }),
    );
  });
});
