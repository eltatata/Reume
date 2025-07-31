export class ScheduleEntity {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public startTime: string,
    public endTime: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static toEntity(obj: unknown): ScheduleEntity {
    const { id, userId, title, startTime, endTime, createdAt, updatedAt } =
      obj as ScheduleEntity;

    return new ScheduleEntity(
      id,
      userId,
      title,
      startTime,
      endTime,
      createdAt,
      updatedAt,
    );
  }
}
