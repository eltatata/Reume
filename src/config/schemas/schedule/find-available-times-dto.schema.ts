import { z } from 'zod';
import { FindAvailableTimesDTO } from '../../../domain';

export const findAvailableTimesSchema: z.ZodType<FindAvailableTimesDTO> =
  z.object({
    date: z.string().superRefine((date, ctx) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date format. Expected YYYY-MM-DD',
        });
        return;
      }

      const [year, month, day] = date.split('-').map(Number);
      const testDate = new Date(year, month - 1, day);

      if (
        testDate.getFullYear() !== year ||
        testDate.getMonth() !== month - 1 ||
        testDate.getDate() !== day
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date',
        });
        return;
      }

      const dayOfWeek = testDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date cannot be a weekend',
        });
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (testDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date cannot be in the past',
        });
      }
    }),
    schedule: z
      .string()
      .trim()
      .uuid({ message: 'Schedule must be a valid UUID' })
      .optional(),
  });
