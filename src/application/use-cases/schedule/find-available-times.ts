import { loggerAdapter } from '../../../config';
import {
  ScheduleRepository,
  FindAvailableTimesUseCase,
  ScheduleEntity,
  FindAvailableTimesDTO,
} from '../../../domain';

const logger = loggerAdapter('FindAvailableTimesUseCase');

export class FindAvailableTimes implements FindAvailableTimesUseCase {
  private readonly START_HOUR = '00:00';
  private readonly END_HOUR = '23:59';

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

    const availableSlots = this.calculateAvailableSlots(
      this.filterSchedules(findAvailableTimesDto.schedule, schedules),
      findAvailableTimesDto.date,
      findAvailableTimesDto.timeZone,
    );

    logger.log(
      `Found ${availableSlots.length} available time slots for date: ${findAvailableTimesDto.date}`,
    );
    return availableSlots;
  }

  private filterSchedules(
    schedule: string | undefined,
    schedules: ScheduleEntity[],
  ): ScheduleEntity[] {
    if (!schedule) return schedules;
    return schedules.filter((item) => item.id !== schedule);
  }

  private calculateAvailableSlots(
    schedules: ScheduleEntity[],
    baseDate: string,
    timeZone: string,
  ): string[] {
    const availableSlots: string[] = [];

    const dayStart = new Date(`${baseDate}T${this.START_HOUR}:00`);
    const dayEnd = new Date(`${baseDate}T${this.END_HOUR}:00`);

    let currentTime = dayStart;

    for (const schedule of schedules) {
      const scheduleStart = this.convertToClientTimeZone(
        new Date(schedule.startTime),
        timeZone,
      );
      const scheduleEnd = this.convertToClientTimeZone(
        new Date(schedule.endTime),
        timeZone,
      );

      if (currentTime < scheduleStart) {
        this.addAvailableSlot(availableSlots, currentTime, scheduleStart);
      }

      if (scheduleEnd > currentTime) {
        currentTime = scheduleEnd;
      }
    }

    if (currentTime < dayEnd) {
      this.addAvailableSlot(availableSlots, currentTime, dayEnd);
    }

    return availableSlots;
  }

  private addAvailableSlot(
    availableSlots: string[],
    startTime: Date,
    endTime: Date,
  ): void {
    availableSlots.push(this.formatTime(startTime));

    let current = new Date(startTime);

    while (current < endTime) {
      const next = new Date(current.getTime() + 15 * 60 * 1000);
      if (next <= endTime) {
        availableSlots.push(this.formatTime(next));
      }
      current = next;
    }
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  private convertToClientTimeZone(date: Date, timeZone: string): Date {
    const clientDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return clientDate;
  }
}
