import { z } from 'zod';

export const zloginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type loginRequest = z.infer<typeof zloginRequest>;
