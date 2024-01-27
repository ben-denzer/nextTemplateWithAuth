import { zEmail } from '@/models/sharedZodTypes';
import { z } from 'zod';

export const zEmailOnly = z.object({
  email: zEmail,
});

export type EmailOnly = z.infer<typeof zEmailOnly>;
