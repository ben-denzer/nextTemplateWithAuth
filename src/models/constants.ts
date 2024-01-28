export const MIN_PASSWORD_LENGTH = 8;
export const SALT_ROUNDS = 11;

export const BASE_URL = process.env.BASE_URL as string;
export const DOMAIN_DISPLAY_NAME = process.env.DOMAIN_DISPLAY_NAME as string;

export const NEXT_APP_ENV = process.env.NEXT_APP_ENV as string;

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const AUTH_TOKEN_COOKIE_NAME = process.env
  .AUTH_TOKEN_COOKIE_NAME as string;

export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_ADDRESS = process.env.DB_ADDRESS as string;
export const DB_PORT = process.env.DB_PORT as string;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string;

export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN as string;
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY as string;

export const NEWRELIC_LOG_KEY = process.env.NEWRELIC_LOG_KEY as string;
export const NEXT_APP_LOG_NAME = process.env.NEXT_APP_LOG_NAME as string;
export const LOG_LEVEL = Number(process.env.LOG_LEVEL);
