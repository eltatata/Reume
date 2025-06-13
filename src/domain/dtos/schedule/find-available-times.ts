import { ValidationResult } from '../../';
import { ZodAdapter, findAvailableTimesSchema } from '../../../config';

interface FindAvailableTimesDTOProps {
  date: string;
}

export class FindAvailableTimesDTO {
  private constructor(public readonly date: string) {}

  static create(
    props: FindAvailableTimesDTOProps,
  ): ValidationResult<FindAvailableTimesDTO> {
    const { errors, validatedData } = ZodAdapter.validate(
      findAvailableTimesSchema,
      props,
    );

    return errors ? { errors } : { validatedData };
  }
}
