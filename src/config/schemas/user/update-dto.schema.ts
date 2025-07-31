import { z } from 'zod';
import { UpdateUserDto, UserRole } from '../../../domain';

export const updateUserSchema: z.ZodType<UpdateUserDto> = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters long')
    .optional(),
  lastname: z
    .string()
    .trim()
    .min(1, 'Lastname is required')
    .max(50, 'Lastname must be at most 50 characters long')
    .optional(),
  email: z.string().trim().email('Invalid email format').optional(),
  password: z
    .string()
    .trim()
    .min(5, 'Password must be at least 5 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
    )
    .optional(),
  role: z
    .enum([UserRole.USER, UserRole.ADMIN], {
      errorMap: () => ({ message: 'Invalid role. Must be USER or ADMIN.' }),
    })
    .optional(),
  verified: z.boolean().optional(),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\+?[0-9]{6,15}$/.test(val), {
      message: 'Invalid phone number format',
    }),
});
