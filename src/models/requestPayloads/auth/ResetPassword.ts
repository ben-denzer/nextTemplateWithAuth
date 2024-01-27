import { zEmail, zPassword } from '@/models/sharedZodTypes';
import { z } from 'zod';

const zResetPasswordBase = z.object({
  email: zEmail,
  password: zPassword,
  password2: zPassword,
});

export const zResetPasswordForm = zResetPasswordBase.refine(
  (data) => data.password === data.password2,
  {
    message: 'Passwords must match',
    path: ['password2'],
  }
);

export type ResetPasswordForm = z.infer<typeof zResetPasswordForm>;

export const zResetPasswordPayload = zResetPasswordBase.extend({
  token: z.string(),
});

export type ResetPasswordPayload = z.infer<typeof zResetPasswordPayload>;
