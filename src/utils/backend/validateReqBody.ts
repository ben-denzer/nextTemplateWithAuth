import { ErrorCodes } from '@/models/errors/ErrorCodes';
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
    throw new Error(ErrorCodes.INVALID_REQUEST_BODY);
  }
};

export default validateReqBody;
