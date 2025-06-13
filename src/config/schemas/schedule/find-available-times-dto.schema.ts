import { z } from 'zod';
import { FindAvailableTimesDTO } from '../../../domain';

export const findAvailableTimesSchema: z.ZodType<FindAvailableTimesDTO> =
  z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected YYYY-MM-DD'),
  });
