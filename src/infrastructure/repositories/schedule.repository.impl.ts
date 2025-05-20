import {
  CreateScheduleDTO,
  ScheduleDatasource,
  ScheduleEntity,
  ScheduleRepository,
  UpdateScheduleDTO,
} from '../../domain';

export class ScheduleRepositoryImpl implements ScheduleRepository {
  constructor(private readonly scheduleDatasource: ScheduleDatasource) {}

  findById(id: string): Promise<ScheduleEntity | null> {
    return this.scheduleDatasource.findById(id);
  }

  findAll(userId?: string): Promise<ScheduleEntity[]> {
    return this.scheduleDatasource.findAll(userId);
  }

  create(
    userId: string,
    createScheduleDto: CreateScheduleDTO,
  ): Promise<ScheduleEntity> {
    return this.scheduleDatasource.create(userId, createScheduleDto);
  }

  update(
    id: string,
    updateScheduleDto: UpdateScheduleDTO,
  ): Promise<ScheduleEntity | null> {
    return this.scheduleDatasource.update(id, updateScheduleDto);
  }

  delete(id: string): Promise<boolean> {
    return this.scheduleDatasource.delete(id);
  }
}
