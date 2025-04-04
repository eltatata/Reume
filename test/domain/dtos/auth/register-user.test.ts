import { RegisterUserDto } from '../../../../src/domain/';

describe('RegisterUserDto', () => {
  test('should return the user when the user is valid', () => {
    const { errors, validatedData } = RegisterUserDto.create({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    });

    expect(errors).toBeUndefined();
    expect(validatedData).toEqual({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    });
  });

  test('should return errors when the user is invalid', () => {
    const { errors, validatedData } = RegisterUserDto.create({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone: '',
    });

    expect(errors).toBeDefined();
    expect(validatedData).toBeUndefined();
  });
});
