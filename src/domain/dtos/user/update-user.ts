import { ValidationResult } from '../../';
import { updateUserSchema, ZodAdapter } from '../../../config';

export interface UpdateUserDtoProps {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  verified?: boolean;
  phone?: string;
}

export class UpdateUserDto {
  private constructor(
    public readonly firstname?: string,
    public readonly lastname?: string,
    public readonly email?: string,
    public readonly password?: string,
    public readonly verified?: boolean,
    public readonly phone?: string,
  ) {}

  static create(props: UpdateUserDtoProps): ValidationResult<UpdateUserDto> {
    const { errors, validatedData } = ZodAdapter.validate(
      updateUserSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
