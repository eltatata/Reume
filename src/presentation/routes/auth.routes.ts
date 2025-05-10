import { Router } from 'express';
import {
  UserDatasourceImpl,
  UserRepositoryImpl,
  OtpDatasourceImpl,
  OtpRepositoryImpl,
  EmailServiceImpl,
} from '../../infrastructure';
import { AuthController } from '../';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailServiceImpl();

    const otpDatasource = new OtpDatasourceImpl();
    const otpRepository = new OtpRepositoryImpl(otpDatasource);

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const authController = new AuthController(
      userRepository,
      otpRepository,
      emailService,
    );

    router.post('/register', authController.registerUser);
    router.post('/login', authController.loginUser);

    return router;
  }
}
