import { zEmail, zPassword } from '@/models/sharedZodTypes';
import { z } from 'zod';

export const zSignupRequest = z
  .object({
    email: zEmail,
    password: zPassword,
    password2: zPassword,
  })
  .refine((data) => data.password === data.password2, {
    message: 'Passwords must match',
    path: ['password2'],
  });

export type SignupRequest = z.infer<typeof zSignupRequest>;
