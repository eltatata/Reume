import { Request, Response } from 'express';
import { ErrorHandlerService, RequestExtended } from '../';
import { UserRepository } from '../../domain';
import { FindAllUsers, FindOneUser } from '../../application';

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  findAllUsers = (req: Request, res: Response) => {
    new FindAllUsers(this.userRepository)
      .execute()
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  findOneUser = (req: RequestExtended, res: Response) => {
    const id = req.params.id;
    const { id: userId, role } = req.user!;

    new FindOneUser(this.userRepository)
      .execute(id, userId, role)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
