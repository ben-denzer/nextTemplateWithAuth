import { z } from 'zod';

export const zLogMetadata = z.record(z.string(), z.any());

export type LogMetadata = z.infer<typeof zLogMetadata>;

export const zLogInfo = z.object({
  method: z.string(),
  message: z.string(),
  severity: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
  metadata: z.record(z.string(), z.any()).optional(),
  errName: z.string().optional(),
  errMessage: z.string().optional(),
  errStack: z.string().optional(),
  errCode: z.string().optional(),
  fromClient: z.boolean().optional(),
});

export type LogInfo = z.infer<typeof zLogInfo>;
