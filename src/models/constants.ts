const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export const MIN_PASSWORD_LENGTH = 8;
export const SALT_ROUNDS = 11;

export const BASE_URL = getEnv('BASE_URL');
export const DOMAIN_DISPLAY_NAME = getEnv('DOMAIN_DISPLAY_NAME');

export const NEXT_APP_ENV = getEnv('NEXT_APP_ENV');

export const JWT_SECRET = getEnv('JWT_SECRET');
export const AUTH_TOKEN_COOKIE_NAME = getEnv('AUTH_TOKEN_COOKIE_NAME');

export const DB_USER = getEnv('DB_USER');
export const DB_PASSWORD = getEnv('DB_PASSWORD');
export const DB_ADDRESS = getEnv('DB_ADDRESS');
export const DB_PORT = getEnv('DB_PORT');
export const DB_NAME = getEnv('DB_NAME');
export const DB_CONNECTION_STRING = getEnv('DB_CONNECTION_STRING');

export const MAILGUN_DOMAIN = getEnv('MAILGUN_DOMAIN');
export const MAILGUN_API_KEY = getEnv('MAILGUN_API_KEY');

export const NEWRELIC_LOG_KEY = getEnv('NEWRELIC_LOG_KEY');
export const NEXT_APP_LOG_NAME = getEnv('NEXT_APP_LOG_NAME');
export const LOG_LEVEL = Number(getEnv('LOG_LEVEL'));
