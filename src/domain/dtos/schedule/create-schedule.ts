import { ValidationResult, WeekDay } from '../../';
import { ZodAdapter, createScheduleSchema } from '../../../config';

interface CreateScheduleDTOProps {
  title: string;
  day: WeekDay;
  date: string | Date;
  startTime: string | Date;
  endTime: string | Date;
}

export class CreateScheduleDTO {
  private constructor(
    public readonly title: string,
    public readonly day: WeekDay,
    public readonly date: string | Date,
    public readonly startTime: string | Date,
    public readonly endTime: string | Date,
  ) {}

  static create(
    props: CreateScheduleDTOProps,
  ): ValidationResult<CreateScheduleDTO> {
    const { errors, validatedData } = ZodAdapter.validate(
      createScheduleSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
