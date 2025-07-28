import { Request, Response } from 'express';
import { ErrorHandlerService, RequestExtended } from '../';
import { UserRepository, UpdateUserDto, EmailService } from '../../domain';
import {
  FindAllUsers,
  FindOneUser,
  UpdateUser,
  RequestUpdateUserEmail,
} from '../../application';

export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

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

  updateUser = (req: RequestExtended, res: Response) => {
    const id = req.params.id;
    const { id: userId, role } = req.user!;
    const { errors, validatedData } = UpdateUserDto.create(req.body);

    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new UpdateUser(this.userRepository)
      .execute(id, userId, role, validatedData!)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };

  requestUpdateUserEmail = (req: RequestExtended, res: Response) => {
    const id = req.params.id;
    const { id: userId, role } = req.user!;
    const { errors, validatedData } = UpdateUserDto.create(req.body);

    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new RequestUpdateUserEmail(this.userRepository, this.emailService)
      .execute(id, userId, role, validatedData!)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
