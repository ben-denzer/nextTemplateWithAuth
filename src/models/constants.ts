export const MIN_PASSWORD_LENGTH = 8;
export const SALT_ROUNDS = 11;
export const AUTH_TOKEN_COOKIE_NAME = process.env
  .AUTH_TOKEN_COOKIE_NAME as string;
export const BASE_URL = process.env.BASE_URL;
export const NEWRELIC_LOG_KEY = process.env.NEWRELIC_LOG_KEY;
export const NEXT_APP_LOG_NAME = process.env.NEXT_APP_LOG_NAME;
export const LOG_LEVEL = Number(process.env.LOG_LEVEL);
