import { Router } from 'express';
import {
  EmailServiceImpl,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from '../../infrastructure';
import { AuthMiddleware, RoleMiddleware, UserController } from '../';
import { UserRole } from '../../domain';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailServiceImpl();

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const userController = new UserController(userRepository, emailService);

    router.get(
      '/',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN]),
      userController.findAllUsers,
    );

    router.get('/update-email', userController.updateUserEmail);

    router.get(
      '/:id',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN, UserRole.USER]),
      userController.findOneUser,
    );

    router.put(
      '/:id',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN, UserRole.USER]),
      userController.updateUser,
    );

    router.post(
      '/:id/email',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN, UserRole.USER]),
      userController.requestUpdateUserEmail,
    );

    return router;
  }
}
