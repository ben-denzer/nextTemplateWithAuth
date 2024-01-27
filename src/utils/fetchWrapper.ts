import { ErrorResponse } from '@/models/responsePayloads/ErrorResponse';
import { PageRoutes } from '@/models/routes';
import { ZodEffects, ZodObject } from 'zod';

async function fetchWrapper<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body: Record<string, unknown> | null, // JSON or null
  validation: {
    zRequestType?: ZodObject<any> | ZodEffects<any> | null;
    zResponseType: ZodObject<any> | ZodEffects<any>;
  },
  options?: {
    headers?: Record<string, string>;
  }
): Promise<T | ErrorResponse> {
  if (body) {
    if (!validation.zRequestType) {
      throw new Error('Validation for request body is required');
    }
    validation.zRequestType.parse(body);
  }

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const resText = await res.text();

  let resJson: ErrorResponse | T | null = null;

  const isErrorResponse = (obj: any): obj is ErrorResponse => {
    return obj.success === false && obj.displayMessage;
  };

  try {
    resJson = JSON.parse(resText);
  } catch (e) {
    // do nothing
  }

  if (!res.ok) {
    if (res.status === 401 && !window.location.pathname.startsWith('/auth/')) {
      // log user out
      window.location.replace(PageRoutes.LOGIN);
    }

    const errorBody = resJson || resText;
    // log errorBody
    if (isErrorResponse(errorBody)) {
      return errorBody;
    }
    throw new Error('Something went wrong. Please try again');
  }

  const validated = validation.zResponseType.safeParse(resJson);

  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  return validated.data;
}

export default fetchWrapper;
