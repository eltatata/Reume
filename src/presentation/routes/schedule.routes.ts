import { Router } from 'express';
import {
  ScheduleDatasourceImpl,
  ScheduleRepositoryImpl,
} from '../../infrastructure';
import { ScheduleController, AuthMiddleware } from '../';

export class ScheduleRoutes {
  static get routes(): Router {
    const router = Router();

    const scheduleDatasource = new ScheduleDatasourceImpl();
    const scheduleRepository = new ScheduleRepositoryImpl(scheduleDatasource);

    const scheduleController = new ScheduleController(scheduleRepository);

    router.post(
      '/',
      AuthMiddleware.validateJWT,
      scheduleController.createSchedule,
    );
    router.get(
      '/',
      AuthMiddleware.validateJWT,
      scheduleController.findAllSchedules,
    );

    return router;
  }
}
