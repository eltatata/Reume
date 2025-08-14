import { ValidationResult } from '../../';
import { ZodAdapter, createScheduleSchema } from '../../../config';

interface CreateScheduleDTOProps {
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  timeZone: string;
}

export class CreateScheduleDTO {
  private constructor(
    public readonly title: string,
    public readonly startTime: string | Date,
    public readonly endTime: string | Date,
    public readonly timeZone: string,
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
