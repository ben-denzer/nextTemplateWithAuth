import { ErrorCodes } from '@/models/errors/ErrorCodes';
import { ErrorResponse } from '@/models/responsePayloads/ErrorResponse';
import { Logger } from '../logger/Logger';

const resError = (req: Request, e: unknown, status = 500) => {
  let displayMessage = 'Something went wrong. Please try again';
  const error: Error = e instanceof Error ? e : new Error('Unknown error');

  Logger.error(`resError: ${req.method} ${req.url}`, error.message, error);

  if (Object.values(ErrorCodes).includes(error.message as ErrorCodes)) {
    displayMessage = error.message;
  }

  const responseBody: ErrorResponse = {
    success: false,
    displayMessage,
  };

  return new Response(JSON.stringify(responseBody), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default resError;
