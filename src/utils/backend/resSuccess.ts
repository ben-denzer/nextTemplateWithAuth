import { ZodEffects, ZodObject } from 'zod';
import { Logger } from '../logger/Logger';

const resSuccess = (
  schema: ZodObject<any> | ZodEffects<any>,
  body: Record<string, unknown>,
  status?: number,
  customHeaders?: Record<string, string>
) => {
  if (body) {
    schema.parse(body);
  }

  Logger.debug('resSuccess', 'success', { body, status, customHeaders });

  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });
};

export default resSuccess;
