import { Response } from 'express';
import { ErrorHandlerService, RequestExtended } from '../';
import {
  CreateScheduleDTO,
  ScheduleRepository,
  UpdateScheduleDTO,
} from '../../domain';
import {
  CreateSchedule,
  DeleteSchedule,
  FindAllSchedules,
  UpdateSchedule,
} from '../../application';

export class ScheduleController {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  createSchedule = (req: RequestExtended, res: Response) => {
    const { errors, validatedData } = CreateScheduleDTO.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new CreateSchedule(this.scheduleRepository)
      .execute(req.user!.id, validatedData!)
      .then((data) => res.status(201).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  findAllSchedules = (req: RequestExtended, res: Response) => {
    new FindAllSchedules(this.scheduleRepository)
      .execute()
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  updateSchedule = (req: RequestExtended, res: Response) => {
    const { errors, validatedData } = UpdateScheduleDTO.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new UpdateSchedule(this.scheduleRepository)
      .execute(req.user!.id, req.params.id, validatedData!)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  deleteSchedule = (req: RequestExtended, res: Response) => {
    new DeleteSchedule(this.scheduleRepository)
      .execute(req.user!.id, req.params.id)
      .then(() => res.status(204).send())
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
