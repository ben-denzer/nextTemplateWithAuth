import { z } from 'zod';

export enum ErrorCodes {
  'INVALID_REQUEST_BODY' = 'INVALID_REQUEST_BODY', // this should never happen with the type safety and zod - so this is for hackers basically
  'INVALID_CREDENTIALS' = 'Your username or password is incorrect.',
}

export const zErrorCodes = z.nativeEnum(ErrorCodes);
