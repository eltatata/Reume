import { WeekDay } from '../';

export class ScheduleEntity {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public day: WeekDay,
    public date: string,
    public startTime: string,
    public endTime: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static toEntity(obj: unknown): ScheduleEntity {
    const {
      id,
      userId,
      title,
      day,
      date,
      startTime,
      endTime,
      createdAt,
      updatedAt,
    } = obj as ScheduleEntity;

    return new ScheduleEntity(
      id,
      userId,
      title,
      day,
      date,
      startTime,
      endTime,
      createdAt,
      updatedAt,
    );
  }
}
