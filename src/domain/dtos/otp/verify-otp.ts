import { ValidationResult } from '../../';
import { verifyOtpSchema, ZodAdapter } from '../../../config';

interface VerifyOtpDtoProps {
  userId: string;
  otp: string;
}

export class VerifyOtpDto {
  private constructor(
    public readonly userId: string,
    public readonly otp: string,
  ) {}

  static create(props: VerifyOtpDtoProps): ValidationResult<VerifyOtpDto> {
    const { errors, validatedData } = ZodAdapter.validate(
      verifyOtpSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
