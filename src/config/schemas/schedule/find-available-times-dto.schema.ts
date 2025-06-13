import { z } from 'zod';
import { FindAvailableTimesDTO } from '../../../domain';

export const findAvailableTimesSchema: z.ZodType<FindAvailableTimesDTO> =
  z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected YYYY-MM-DD')
      .refine(
        (date) => {
          const [year, month, day] = date.split('-').map(Number);
          const dayOfWeek = new Date(year, month - 1, day).getDay();

          return dayOfWeek !== 0 && dayOfWeek !== 6;
        },
        { message: 'Date cannot be a weekend' },
      )
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const [year, month, day] = date.split('-').map(Number);
          const selectedDate = new Date(year, month - 1, day);

          return selectedDate >= today;
        },
        { message: 'Date cannot be in the past' },
      ),
  });
