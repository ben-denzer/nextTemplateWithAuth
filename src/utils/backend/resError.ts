import { ErrorResponse } from '@/models/responsePayloads/ErrorResponse';
import { Logger } from '../logger/Logger';
import { AuthError } from '@/models/errors/AuthError';
import { InvalidRequestPayloadError } from '@/models/errors/InvalidRequestPayloadError';
import { ConflictError } from '@/models/errors/ConflictError';

type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;

interface InfoForClient {
  displayMessage: string;
  status: ErrorStatus;
}

const inferStatusFromError = (error: Error): InfoForClient => {
  if (error instanceof AuthError) {
    return {
      displayMessage: 'You are not authorized to perform this action',
      status: 401,
    };
  }
  if (error instanceof InvalidRequestPayloadError) {
    return {
      displayMessage: 'Invalid request payload',
      status: 400,
    };
  }
  if (error instanceof ConflictError) {
    return {
      displayMessage: 'Conflict',
      status: 409,
    };
  }

  return {
    displayMessage: 'Something went wrong. Please try again',
    status: 500,
  };
};

const resError = (req: Request, e: unknown, infoForClient?: InfoForClient) => {
  const error: Error = e instanceof Error ? e : new Error('Unknown error');

  const { displayMessage, status } =
    infoForClient || inferStatusFromError(error);

  Logger.error(`resError: ${req.method} ${req.url}`, error.message, error);

  const responseBody: ErrorResponse = {
    status,
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
