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
    router.get(
      '/available-times/:date',
      AuthMiddleware.validateJWT,
      scheduleController.findAvailableTimes,
    );
    router.put(
      '/:id',
      AuthMiddleware.validateJWT,
      scheduleController.updateSchedule,
    );
    router.delete(
      '/:id',
      AuthMiddleware.validateJWT,
      scheduleController.deleteSchedule,
    );

    return router;
  }
}
