import { loggerAdapter } from '../../../config';
import {
  ScheduleRepository,
  FindAvailableTimesUseCase,
  ScheduleEntity,
  FindAvailableTimesDTO,
} from '../../../domain';

const logger = loggerAdapter('FindAvailableTimesUseCase');

export class FindAvailableTimes implements FindAvailableTimesUseCase {
  private readonly START_HOUR = 6;
  private readonly END_HOUR = 18;

  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(
    findAvailableTimesDto: FindAvailableTimesDTO,
  ): Promise<string[]> {
    logger.log(
      `Finding available times for date: ${findAvailableTimesDto.date}`,
    );

    const schedules = await this.scheduleRepository.findByDate(
      findAvailableTimesDto,
    );

    const availableTimes = this.generateTimeSlots();
    const filteredTimes = this.filterOccupiedSlots(
      availableTimes,
      schedules,
      findAvailableTimesDto.date,
    );

    logger.log(
      `Found ${filteredTimes.length} available time slots for date: ${findAvailableTimesDto.date}`,
    );
    return filteredTimes;
  }

  private generateTimeSlots(): string[] {
    const timeSlots: string[] = [];

    for (let hour = this.START_HOUR; hour < this.END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        timeSlots.push(timeSlot);
      }
    }

    return timeSlots;
  }

  private filterOccupiedSlots(
    timeSlots: string[],
    schedules: ScheduleEntity[],
    baseDate: string,
  ): string[] {
    const scheduleRanges = schedules.map((schedule) => ({
      start: new Date(schedule.startTime),
      end: new Date(schedule.endTime),
    }));

    return timeSlots.filter((timeSlot) => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const [year, month, day] = baseDate.split('-').map(Number);
      const slotDateTime = new Date(year, month - 1, day, hour, minute);

      return !scheduleRanges.some(
        ({ start, end }) => slotDateTime >= start && slotDateTime < end,
      );
    });
  }
}
