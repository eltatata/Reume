import { prisma } from '../../data/prisma.connection';
import {
  CreateScheduleDTO,
  FindAvailableTimesDTO,
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

  async findOverlapping(
    startTime: Date,
    endTime: Date,
  ): Promise<ScheduleEntity[]> {
    const schedules = await prisma.schedule.findMany({
      where: {
        NOT: {
          OR: [
            {
              endTime: {
                lte: startTime,
              },
            },
            {
              startTime: {
                gte: endTime,
              },
            },
          ],
        },
      },
    });
    return schedules.map(ScheduleEntity.toEntity);
  }

  async findByDate(
    findAvailableTimesDto: FindAvailableTimesDTO,
  ): Promise<ScheduleEntity[]> {
    const [year, month, day] = findAvailableTimesDto.date
      .split('-')
      .map(Number);
    const startOfDay = new Date(year, month - 1, day, 6, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 18, 0, 0, 0);

    const schedules = await prisma.schedule.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return schedules.map(ScheduleEntity.toEntity);
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
        title: createScheduleDto.title,
        startTime: createScheduleDto.startTime,
        endTime: createScheduleDto.endTime,
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
      data: {
        title: updateScheduleDto.title,
        startTime: updateScheduleDto.startTime,
        endTime: updateScheduleDto.endTime,
      },
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
