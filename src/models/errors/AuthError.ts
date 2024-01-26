import { ErrorCodes } from './ErrorCodes';

export class AuthError extends Error {
  constructor(message?: string) {
    super(message || 'unauthorized');
    this.name = ErrorCodes.AUTH_ERROR;
  }
}
