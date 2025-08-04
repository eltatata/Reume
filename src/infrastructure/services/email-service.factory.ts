import { envs } from '../../config';
import { EmailService } from '../../domain';
import { ResendEmailServiceImpl, NodemailerEmailServiceImpl } from '../';

export type EmailProvider = 'resend' | 'nodemailer';

export class EmailServiceFactory {
  static create(provider?: EmailProvider): EmailService {
    const emailProvider = provider || envs.EMAIL_PROVIDER;

    switch (emailProvider) {
      case 'resend':
        return new ResendEmailServiceImpl();

      case 'nodemailer':
        if (
          !envs.SMTP_HOST ||
          !envs.SMTP_USER ||
          !envs.SMTP_PASSWORD ||
          !envs.SMTP_FROM_EMAIL
        ) {
          throw new Error(
            'SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL) is required when using nodemailer provider',
          );
        }
        return new NodemailerEmailServiceImpl();

      default:
        throw new Error(
          `Unknown email provider: ${emailProvider}. Supported providers: resend, nodemailer`,
        );
    }
  }
}
