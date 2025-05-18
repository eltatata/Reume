import { z } from 'zod';
import { UpdateScheduleDTO, WeekDay } from '../../../domain';

export const updateScheduleSchema: z.ZodType<UpdateScheduleDTO> = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters long')
      .max(200, 'Title must be at most 200 characters long')
      .optional(),
    day: z
      .nativeEnum(WeekDay, {
        errorMap: () => ({ message: 'Invalid day of the week' }),
      })
      .optional(),
    startTime: z
      .string()
      .trim()
      .regex(
        /^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Invalid start time format. Use HH:MM AM/PM',
      )
      .transform((timeStr) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        const date = new Date();
        date.setHours(
          period === 'PM' && hours !== 12
            ? hours + 12
            : hours === 12 && period === 'AM'
              ? 0
              : hours,
          minutes,
          0,
          0,
        );

        return date;
      })
      .optional(),
    endTime: z
      .string()
      .trim()
      .regex(
        /^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Invalid end time format. Use HH:MM AM/PM',
      )
      .transform((timeStr) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        const date = new Date();
        date.setHours(
          period === 'PM' && hours !== 12
            ? hours + 12
            : hours === 12 && period === 'AM'
              ? 0
              : hours,
          minutes,
          0,
          0,
        );

        return date;
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    },
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return (
          data.startTime.getMinutes() % 15 === 0 &&
          data.endTime.getMinutes() % 15 === 0
        );
      }
      return true;
    },
    {
      message: 'Times must be in 15-minute intervals',
      path: ['startTime'],
    },
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const startHour = data.startTime.getHours();
        const endHour = data.endTime.getHours();

        return (
          startHour >= 6 &&
          (startHour < 18 ||
            (startHour === 18 && data.startTime.getMinutes() === 0)) &&
          endHour <= 18 &&
          (endHour > 6 || (endHour === 6 && data.endTime.getMinutes() === 0))
        );
      }

      return true;
    },
    {
      message: 'Times must be between 6:00 AM and 6:00 PM',
      path: ['startTime'],
    },
  )
  .refine(
    (data) => {
      const hasStartTime = data.startTime !== undefined;
      const hasEndTime = data.endTime !== undefined;

      return !(hasStartTime && !hasEndTime) && !(!hasStartTime && hasEndTime);
    },
    {
      message: 'Both start time and end time must be provided together',
      path: ['startTime'],
    },
  )
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    },
  );
