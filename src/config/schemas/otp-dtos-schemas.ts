import { z } from 'zod';
import { ResendOtpDto, VerifyOtpDto } from '../../domain';

export const verifyOtpSchema: z.ZodType<VerifyOtpDto> = z.object({
  userId: z.string().uuid('Invalid user ID'),
  otp: z.string().length(6, 'OTP must be 6 digits long'),
});

export const resendOtpSchema: z.ZodType<ResendOtpDto> = z.object({
  email: z.string().email('Invalid email address'),
});
