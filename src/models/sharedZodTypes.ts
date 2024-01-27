import z from 'zod';
import { MIN_PASSWORD_LENGTH } from './constants';

export const zEmail = z.string().email({ message: 'Invalid email address' });
export const zPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, {
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  });
