import { Request, Response } from 'express';
import { ErrorHandlerService } from '../';
import { RegisterUser, RegisterUserDto, UserRepository } from '../../domain';

export class AuthController {
  constructor(private readonly userRepository: UserRepository) {}

  registerUser = (req: Request, res: Response) => {
    const { errors, validatedData } = RegisterUserDto.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new RegisterUser(this.userRepository)
      .execute(validatedData!)
      .then((data) => res.status(201).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
