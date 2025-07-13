import { Request, Response } from 'express';
import { ErrorHandlerService } from '../';
import { UserRepository } from '../../domain';
import { FindAllUsers } from '../../application';

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  findAllUsers = (req: Request, res: Response) => {
    new FindAllUsers(this.userRepository)
      .execute()
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
