import { Router } from 'express';
import {
  OtpDatasourceImpl,
  OtpRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from '../../infrastructure';
import { OtpController } from '../';

export class OtpRoutes {
  static get routes(): Router {
    const router = Router();

    const otpDatasource = new OtpDatasourceImpl();
    const otpRepository = new OtpRepositoryImpl(otpDatasource);

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const otpController = new OtpController(otpRepository, userRepository);

    router.post('/verify', otpController.verifyOtp);

    return router;
  }
}
