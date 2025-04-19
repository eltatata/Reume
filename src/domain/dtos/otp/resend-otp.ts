import { ValidationResult } from '../../';
import { resendOtpSchema, ZodAdapter } from '../../../config';

interface ResendOtpDtoProps {
  email: string;
}

export class ResendOtpDto {
  private constructor(public readonly email: string) {}

  static create(props: ResendOtpDtoProps): ValidationResult<ResendOtpDto> {
    const { errors, validatedData } = ZodAdapter.validate(
      resendOtpSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
