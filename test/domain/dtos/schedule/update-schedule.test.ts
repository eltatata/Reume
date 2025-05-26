import { UpdateScheduleDTO } from '../../../../src/domain';

describe('UpdateScheduleDTO', () => {
  test('should create a valid UpdateScheduleDTO', () => {
    const data = {
      title: 'Meeting',
      startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    };

    const result = UpdateScheduleDTO.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.title).toBe(data.title);
    expect(result?.validatedData?.startTime).toEqual(new Date(data.startTime));
    expect(result?.validatedData?.endTime).toEqual(new Date(data.endTime));
  });

  test('should return error because the title does not have the minimum length', () => {
    const data = {
      title: 'Meet',
      startTime: '2025-05-24T11:30:00.000Z',
      endTime: '2025-05-24T12:00:00.000Z',
    };

    const result = UpdateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Title must be at least 5 characters long',
      }),
    );
  });

  test('should return error because the end date is before the start date', () => {
    const data = {
      title: 'Meeting',
      startTime: '2025-05-24T12:00:00.000Z',
      endTime: '2025-05-24T11:30:00.000Z',
    };

    const result = UpdateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'End time must be after start time',
      }),
    );
  });

  test('should return error because time is not 15 mins interval time', () => {
    const data = {
      title: 'Meeting',
      startTime: '2025-05-24T11:31:00.000Z',
      endTime: '2025-05-24T12:15:00.000Z',
    };

    const result = UpdateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Times must be in 15-minute intervals',
      }),
    );
  });

  test('should return error because it is a date in the past', () => {
    const data = {
      title: 'Meeting',
      startTime: '2020-05-24T11:30:00.000Z',
      endTime: '2020-05-24T12:00:00.000Z',
    };

    const result = UpdateScheduleDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedules cannot be created in the past',
      }),
    );
  });
});
