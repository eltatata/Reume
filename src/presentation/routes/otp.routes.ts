import { Router } from 'express';
import {
  EmailServiceImpl,
  OtpDatasourceImpl,
  OtpRepositoryImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from '../../infrastructure';
import { OtpController } from '../';

export class OtpRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailServiceImpl();

    const otpDatasource = new OtpDatasourceImpl();
    const otpRepository = new OtpRepositoryImpl(otpDatasource);

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const otpController = new OtpController(
      otpRepository,
      userRepository,
      emailService,
    );

    router.post('/verify', otpController.verifyOtp);
    router.post('/resend', otpController.resendOtp);

    return router;
  }
}
