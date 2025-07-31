import { z } from 'zod';
import { ResendOtpDto } from '../../../domain';

export const resendOtpSchema: z.ZodType<ResendOtpDto> = z.object({
  email: z.string().email('Invalid email address'),
});
