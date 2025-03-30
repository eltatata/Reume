import { ValidationResult } from '../../';
import { registerUserSchema, ZodAdapter } from '../../../config';

interface RegisterUserDtoProps {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}

export class RegisterUserDto {
  private constructor(
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly phone?: string,
  ) {}

  static create(
    props: RegisterUserDtoProps,
  ): ValidationResult<RegisterUserDto> {
    const { errors, validatedData } = ZodAdapter.validate(
      registerUserSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
