import { z } from 'zod';

export const zSuccessResponse = z.object({
  success: z.literal(true),
});

export type SuccessResponse = z.infer<typeof zSuccessResponse>;

export const SUCCESS_RESPONSE = { success: true };
