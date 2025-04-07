import { Request, Response } from 'express';
import { ErrorHandlerService } from '../';
import {
  OtpRepository,
  UserRepository,
  VerifyOtp,
  VerifyOtpDto,
} from '../../domain';

export class OtpController {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
  ) {}

  verifyOtp = (req: Request, res: Response) => {
    const { errors, validatedData } = VerifyOtpDto.create(req.body);
    if (errors) {
      res.status(400).json({ errors });
      return;
    }

    new VerifyOtp(this.otpRepository, this.userRepository)
      .execute(validatedData!)
      .then((data) => res.status(200).json(data))
      .catch((error) => ErrorHandlerService.handleError(error, res));
  };
}
