import { InvalidRequestPayloadError } from '@/models/errors/InvalidRequestPayloadError';
import { ZodEffects, ZodObject } from 'zod';

const validateReqBody = (
  schema: ZodObject<any> | ZodEffects<any>,
  body: Record<string, unknown>
) => {
  if (!schema) {
    return;
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new InvalidRequestPayloadError('Invalid request payload');
  }
};

export default validateReqBody;
