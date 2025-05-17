import { z } from 'zod';
import { LoginUserDto } from '../../../domain';

export const loginUserSchema: z.ZodType<LoginUserDto> = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z
    .string()
    .trim()
    .min(5, 'Password must be at least 5 characters long'),
});
