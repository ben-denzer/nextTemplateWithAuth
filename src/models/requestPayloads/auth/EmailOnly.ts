import { z } from 'zod';

export const zEmailOnly = z.object({
  email: z.string().email(),
});

export type EmailOnly = z.infer<typeof zEmailOnly>;
