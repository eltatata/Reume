import { EmailService } from '../../src/domain';

export class MockEmailService implements EmailService {
  async sendVerificationEmail(): Promise<void> {
    return Promise.resolve();
  }
}
