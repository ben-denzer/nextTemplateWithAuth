import { zEmail } from '@/models/sharedZodTypes';
import { z } from 'zod';

export const zLoginRequest = z.object({
  email: zEmail,
  // do not use zPassword here, because we don't want to reveal the password requirements to the user
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginRequest = z.infer<typeof zLoginRequest>;
