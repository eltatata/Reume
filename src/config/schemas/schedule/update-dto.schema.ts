import { z } from 'zod';
import { UpdateScheduleDTO } from '../../../domain';

export const updateScheduleSchema: z.ZodType<UpdateScheduleDTO> = z
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
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (
        data.startTime.getTime() >= today.getTime() &&
        data.endTime.getTime() >= today.getTime()
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
  )
  .refine(
    (data) => {
      const isInRange = (date: Date) => {
        const hour = date.getHours();
        return hour >= 6 && hour <= 18;
      };

      return isInRange(data.startTime) && isInRange(data.endTime);
    },
    {
      message: 'Times must be between 06:00 am and 06:00 pm',
      path: ['startTime'],
    },
  );
