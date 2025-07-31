import { Resend } from 'resend';
import { envs } from '../../config';
import { EmailService } from '../../domain';

export class EmailServiceImpl implements EmailService {
  private readonly resend = new Resend(envs.RESEND_API_KEY);

  async sendVerificationEmail(
    to: string,
    name: string,
    otp: string,
  ): Promise<void> {
    const body = `
      <h1>Welcome to our platform!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
      <h2 style="color: #4CAF50; font-size: 24px; letter-spacing: 2px;">${otp}</h2>
      <p>This OTP will expire in 15 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
      <p>Best regards,<br>The Team</p>
    `;

    await this.resend.emails.send({
      from: 'Resend <onboarding@resend.dev>',
      to,
      subject: 'Verify your email address',
      html: body,
    });
  }

  async sendEmailVerificationLink(
    to: string,
    verificationLink: string,
  ): Promise<void> {
    const body = `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="color: #4CAF50; font-size: 18px;">Verify Email</a>
      <p>If you didn't request this verification, please ignore this email.</p>
      <p>Best regards,<br>The Team</p>
    `;

    await this.resend.emails.send({
      from: 'Resend <onboarding@resend.dev>',
      to,
      subject: 'Verify your email address',
      html: body,
    });
  }
}
