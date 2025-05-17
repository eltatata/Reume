import { z } from 'zod';
import { UpdateUserDto } from '../../../domain';

export const updateUserSchema: z.ZodType<UpdateUserDto> = z.object({
  firstname: z.string().trim().optional(),
  lastname: z.string().trim().optional(),
  email: z.string().trim().email('Invalid email format').optional(),
  password: z.string().trim().optional(),
  verified: z.boolean().optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{6,15}$/, 'Invalid phone number format')
    .optional(),
});
