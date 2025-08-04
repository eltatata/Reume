import { Router } from 'express';
import {
  EmailServiceFactory,
  UserDatasourceImpl,
  UserRepositoryImpl,
} from '../../infrastructure';
import { AuthMiddleware, RoleMiddleware, UserController } from '../';
import { UserRole } from '../../domain';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = EmailServiceFactory.create();

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

    router.post(
      '/:id/email',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN, UserRole.USER]),
      userController.requestUpdateUserEmail,
    );

    router.put(
      '/:id',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN, UserRole.USER]),
      userController.updateUser,
    );

    router.put(
      '/:id/role',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN]),
      userController.updateUserRole,
    );

    router.delete(
      '/:id',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN, UserRole.USER]),
      userController.deleteUser,
    );

    return router;
  }
}
