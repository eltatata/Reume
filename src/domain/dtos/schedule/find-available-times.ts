import { ValidationResult } from '../../';
import { ZodAdapter, findAvailableTimesSchema } from '../../../config';

interface FindAvailableTimesDTOProps {
  date: string;
  schedule?: string;
}

export class FindAvailableTimesDTO {
  private constructor(
    public readonly date: string,
    public readonly schedule?: string,
  ) {}

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
