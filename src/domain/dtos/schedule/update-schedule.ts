import { ValidationResult, WeekDay } from '../../';
import { ZodAdapter, updateScheduleSchema } from '../../../config';

interface UpdateScheduleDTOProps {
  title?: string;
  day?: WeekDay;
  startTime?: string | Date;
  endTime?: string | Date;
}

export class UpdateScheduleDTO {
  private constructor(
    public readonly title?: string,
    public readonly day?: WeekDay,
    public readonly startTime?: string | Date,
    public readonly endTime?: string | Date,
  ) {}

  static create(
    props: UpdateScheduleDTOProps,
  ): ValidationResult<UpdateScheduleDTO> {
    const { errors, validatedData } = ZodAdapter.validate(
      updateScheduleSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
