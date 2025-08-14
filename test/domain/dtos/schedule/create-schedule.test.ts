import { CreateScheduleDTO } from '../../../../src/domain';

const toISOInTimeZone = (timeZone: string, hour: number, minute = 0) => {
  const { year, month, day } = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );

  return new Date(
    Date.UTC(+year, +month - 1, +day, hour, minute),
  ).toISOString();
};

describe('CreateScheduleDTO', () => {
  test('should create a valid CreateScheduleDTO', () => {
    const timeZone = 'America/Bogota';

    const data = {
      title: 'Meeting',
      startTime: toISOInTimeZone(timeZone, 11, 0),
      endTime: toISOInTimeZone(timeZone, 12, 0),
      timeZone,
    };

    const result = CreateScheduleDTO.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.title).toBe(data.title);
    expect(result?.validatedData?.startTime).toEqual(new Date(data.startTime));
    expect(result?.validatedData?.endTime).toEqual(new Date(data.endTime));
  });

  test('should return error because the title does not have the minimum length', () => {
    const timeZone = 'Europe/Moscow';

    const data = {
      title: 'Meet',
      startTime: toISOInTimeZone(timeZone, 11, 30),
      endTime: toISOInTimeZone(timeZone, 12, 0),
      timeZone,
    };

    const result = CreateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Title must be at least 5 characters long',
      }),
    );
  });

  test('should return error because the end date is before the start date', () => {
    const timeZone = 'Europe/Moscow';

    const data = {
      title: 'Meeting',
      startTime: toISOInTimeZone(timeZone, 12, 0),
      endTime: toISOInTimeZone(timeZone, 11, 30),
      timeZone,
    };

    const result = CreateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'End time must be after start time',
      }),
    );
  });

  test('should return error because time is not 15 mins interval time', () => {
    const timeZone = 'Australia/Sydney';

    const data = {
      title: 'Meeting',
      startTime: toISOInTimeZone(timeZone, 11, 31),
      endTime: toISOInTimeZone(timeZone, 12, 15),
      timeZone,
    };

    const result = CreateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Times must be in 15-minute intervals',
      }),
    );
  });

  test('should return error because it is a date in the past', () => {
    const timeZone = 'Pacific/Guam';

    const data = {
      title: 'Meeting',
      startTime: '2020-05-24T11:30:00.000Z',
      endTime: '2020-05-24T12:00:00.000Z',
      timeZone,
    };

    const result = CreateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedules cannot be created in the past',
      }),
    );
  });
});
