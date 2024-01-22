import { ZodEffects, ZodObject } from 'zod';

const resSuccess = (
  schema: ZodObject<any> | ZodEffects<any>,
  body: Record<string, unknown>,
  status?: number,
  customHeaders?: Record<string, string>
) => {
  if (body) {
    schema.parse(body);
  }

  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });
};

export default resSuccess;
