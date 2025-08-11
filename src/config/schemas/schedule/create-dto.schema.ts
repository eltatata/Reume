import { z } from 'zod';
import { CreateScheduleDTO } from '../../../domain';

export const createScheduleSchema: z.ZodType<CreateScheduleDTO> = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters long')
      .max(200, 'Title must be at most 200 characters long'),
    startTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Start must be a valid ISO date string',
      })
      .transform((val) => new Date(val)),
    endTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'End must be a valid ISO date string',
      })
      .transform((val) => new Date(val)),
    timeZone: z.string().min(1, 'Time zone is required'),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .refine(
    (data) => {
      const now = new Date();
      const clientToday = new Date(
        now.toLocaleString('en-US', { timeZone: data.timeZone }),
      );
      clientToday.setHours(0, 0, 0, 0);

      const startInClientTz = new Date(
        data.startTime.toLocaleString('en-US', {
          timeZone: data.timeZone,
        }),
      );
      const endInClientTz = new Date(
        data.endTime.toLocaleString('en-US', {
          timeZone: data.timeZone,
        }),
      );

      return (
        startInClientTz.getTime() >= clientToday.getTime() &&
        endInClientTz.getTime() >= clientToday.getTime()
      );
    },
    {
      message: 'Schedules cannot be created in the past',
      path: ['startTime'],
    },
  )
  .refine(
    (data) =>
      data.startTime.getMinutes() % 15 === 0 &&
      data.endTime.getMinutes() % 15 === 0,
    {
      message: 'Times must be in 15-minute intervals',
      path: ['startTime'],
    },
  );
