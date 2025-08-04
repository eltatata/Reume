import { get } from 'env-var';

export const envs = {
  NODE_ENV: get('NODE_ENV').default('development').asString(),
  PORT: get('PORT').required().asPortNumber(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),

  EMAIL_PROVIDER: get('EMAIL_PROVIDER')
    .default('resend')
    .asEnum(['resend', 'nodemailer']),

  RESEND_API_KEY: get('RESEND_API_KEY').required().asString(),

  SMTP_HOST: get('SMTP_HOST').asString(),
  SMTP_PORT: get('SMTP_PORT').asPortNumber(),
  SMTP_USER: get('SMTP_USER').asString(),
  SMTP_PASSWORD: get('SMTP_PASSWORD').asString(),
  SMTP_FROM_EMAIL: get('SMTP_FROM_EMAIL').asString(),
  SMTP_FROM_NAME: get('SMTP_FROM_NAME').default('The Team').asString(),

  JWT_SECRET: get('JWT_SECRET').required().asString(),
  REUME_FRONTEND_URL: get('REUME_FRONTEND_URL').required().asString(),
  ORIGIN_URL: get('ORIGIN_URL').required().asString(),
};
