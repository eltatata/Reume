import { prisma } from '../../data/prisma.connection';
import {
  CreateScheduleDTO,
  ScheduleDatasource,
  ScheduleEntity,
  UpdateScheduleDTO,
} from '../../domain';

export class ScheduleDatasourceImpl implements ScheduleDatasource {
  async findById(id: string): Promise<ScheduleEntity | null> {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });
    return schedule ? ScheduleEntity.toEntity(schedule) : null;
  }

  async findAll(userId?: string): Promise<ScheduleEntity[]> {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
      },
    });
    return schedules.map(ScheduleEntity.toEntity);
  }

  async create(
    userId: string,
    createScheduleDto: CreateScheduleDTO,
  ): Promise<ScheduleEntity> {
    const schedule = await prisma.schedule.create({
      data: {
        userId,
        ...createScheduleDto,
      },
    });
    return ScheduleEntity.toEntity(schedule);
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDTO,
  ): Promise<ScheduleEntity | null> {
    const schedule = await prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
    });
    return ScheduleEntity.toEntity(schedule);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.schedule.delete({
      where: { id },
    });
    return true;
  }
}
