import { Request, Response } from 'express';
import { ErrorHandlerService } from '../';
import {
  RegisterUser,
  RegisterUserDto,
  UserRepository,
  OtpRepository,
  EmailService,
} from '../../domain';

export class AuthController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
  ) {}

  registerUser = (req: Request, res: Response) => {
    const { errors, validatedData } = RegisterUserDto.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new RegisterUser(this.userRepository, this.otpRepository, this.emailService)
      .execute(validatedData!)
      .then((data) => res.status(201).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
