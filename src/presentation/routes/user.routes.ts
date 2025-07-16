import { Router } from 'express';
import { UserDatasourceImpl, UserRepositoryImpl } from '../../infrastructure';
import { AuthMiddleware, RoleMiddleware, UserController } from '../';
import { UserRole } from '../../domain';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const userController = new UserController(userRepository);

    router.get(
      '/',
      AuthMiddleware.validateJWT,
      RoleMiddleware.validateRole([UserRole.ADMIN]),
      userController.findAllUsers,
    );

    return router;
  }
}
