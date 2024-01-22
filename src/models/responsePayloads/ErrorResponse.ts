import { z } from 'zod';

export const zErrorResponse = z.object({
  success: z.literal(false),
  displayMessage: z.string(),
});

export type ErrorResponse = z.infer<typeof zErrorResponse>;
