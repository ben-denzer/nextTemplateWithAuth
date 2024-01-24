import { MIN_PASSWORD_LENGTH } from '@/models/constants';
import { z } from 'zod';

export const zSignupRequest = z
  .object({
    email: z.string().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    password2: z.string().min(MIN_PASSWORD_LENGTH),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Passwords must match',
    path: ['password2'],
  });

export type SignupRequest = z.infer<typeof zSignupRequest>;
