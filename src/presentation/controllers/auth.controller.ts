import { Request, Response } from 'express';
import { ErrorHandlerService } from '../';
import {
  RegisterUserDto,
  LoginUserDto,
  UserRepository,
  OtpRepository,
  EmailService,
} from '../../domain';
import { RegisterUser, LoginUser } from '../../application';

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

  loginUser = (req: Request, res: Response) => {
    const { errors, validatedData } = LoginUserDto.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new LoginUser(this.userRepository)
      .execute(validatedData!)
      .then((data) => {
        if (data.token) {
          res.status(200).json(data);
        } else {
          res.status(403).json(data);
        }
      })
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
