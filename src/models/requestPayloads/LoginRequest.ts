import { z } from 'zod';

export const zLoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof zLoginRequest>;
export type LoginRequestFields = keyof LoginRequest;
