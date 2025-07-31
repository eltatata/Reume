import { Response } from 'express';
import { ErrorHandlerService, RequestExtended } from '../';
import {
  CreateScheduleDTO,
  FindAvailableTimesDTO,
  ScheduleRepository,
  UpdateScheduleDTO,
} from '../../domain';
import {
  CreateSchedule,
  DeleteSchedule,
  FindAllSchedules,
  FindAvailableTimes,
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
    const { id: userId, role } = req.user!;

    new FindAllSchedules(this.scheduleRepository)
      .execute(userId, role)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  findAvailableTimes = (req: RequestExtended, res: Response) => {
    const { date } = req.params;
    const { schedule } = req.query;
    const { errors, validatedData } = FindAvailableTimesDTO.create({
      date,
      schedule: typeof schedule === 'string' ? schedule : undefined,
    });

    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new FindAvailableTimes(this.scheduleRepository)
      .execute(validatedData!)
      .then((data) => res.status(200).json({ availableTimes: data }))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  updateSchedule = (req: RequestExtended, res: Response) => {
    const { id: userId, role } = req.user!;
    const { errors, validatedData } = UpdateScheduleDTO.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new UpdateSchedule(this.scheduleRepository)
      .execute(userId, req.params.id, validatedData!, role)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  deleteSchedule = (req: RequestExtended, res: Response) => {
    const { id: userId, role } = req.user!;

    new DeleteSchedule(this.scheduleRepository)
      .execute(userId, req.params.id, role)
      .then(() => res.status(204).send())
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
