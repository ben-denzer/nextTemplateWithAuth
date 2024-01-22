import { ErrorCodes } from '@/models/ErrorCodes';
import { ErrorResponse } from '@/models/responsePayloads/ErrorResponse';

const resError = (req: Request, e: unknown, status = 500) => {
  let displayMessage = 'Something went wrong. Please try again';
  const error: Error = e instanceof Error ? e : new Error('Unknown error');

  // log this

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
