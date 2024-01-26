import { AUTH_TOKEN_COOKIE_NAME } from '@/models/constants';
import { AuthError } from '@/models/errors/AuthError';
import { SUCCESS_RESPONSE, zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import { verifyAuthToken } from '@/utils/backend/authToken';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const authToken = req.headers.get('Authorization')?.split(' ')[1] || cookies().get(AUTH_TOKEN_COOKIE_NAME)?.value;
    if (!authToken) {
      throw new AuthError('No auth token');
    }

    await verifyAuthToken(authToken);

    return resSuccess(zSuccessResponse, SUCCESS_RESPONSE, 200);
  } catch (err) {
    return resError(req, err, 401);
  }
}
