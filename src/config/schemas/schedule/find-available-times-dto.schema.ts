import { z } from 'zod';
import { FindAvailableTimesDTO } from '../../../domain';

export const findAvailableTimesSchema: z.ZodType<FindAvailableTimesDTO> = z
  .object({
    date: z.string().date('Invalid date format. Expected YYYY-MM-DD'),
    timeZone: z.string().min(1, 'Time zone is required'),
    schedule: z
      .string()
      .trim()
      .uuid({ message: 'Schedule must be a valid UUID' })
      .optional(),
  })
  .refine(
    (data) => {
      const now = new Date();
      const clientToday = new Date(
        now.toLocaleString('en-US', { timeZone: data.timeZone }),
      );
      clientToday.setHours(0, 0, 0, 0);

      const [year, month, day] = data.date.split('-').map(Number);
      const requestedDate = new Date(year, month - 1, day);

      return requestedDate.getTime() >= clientToday.getTime();
    },
    {
      message: 'Date cannot be in the past',
      path: ['date'],
    },
  );
