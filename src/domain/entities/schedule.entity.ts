import { WeekDay } from '../';

export class ScheduleEntity {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public day: WeekDay,
    public startTime: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static toEntity(obj: unknown): ScheduleEntity {
    const { id, userId, title, day, startTime, createdAt, updatedAt } =
      obj as ScheduleEntity;

    return new ScheduleEntity(
      id,
      userId,
      title,
      day,
      startTime,
      createdAt,
      updatedAt,
    );
  }
}
