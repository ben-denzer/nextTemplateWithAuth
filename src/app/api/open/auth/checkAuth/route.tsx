import { AUTH_TOKEN_COOKIE_NAME } from '@/models/constants';
import { AuthError } from '@/models/errors/AuthError';
import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import { verifyAuthToken } from '@/utils/backend/authToken';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import { cookies } from 'next/headers';
import { prisma } from '@/utils/backend/prisma';

export async function GET(req: Request) {
  try {
    const authToken =
      req.headers.get('Authorization')?.split(' ')[1] ||
      cookies().get(AUTH_TOKEN_COOKIE_NAME)?.value;

    if (!authToken) {
      throw new AuthError('No auth token');
    }

    try {
      await verifyAuthToken(authToken);
    } catch (err) {
      try {
        await prisma.authToken.delete({
          where: {
            token: authToken,
          },
        });
      } catch (prismaError: any) {
        // P2025 is the error code for "Record to delete does not exist."
        if (prismaError.code !== 'P2025') {
          throw new Error(prismaError);
        }
      }

      throw new AuthError('Invalid auth token');
    }

    return resSuccess(zSuccessResponse, SUCCESS_RESPONSE, 200);
  } catch (err) {
    cookies().set(AUTH_TOKEN_COOKIE_NAME, '');
    return resError(req, err);
  }
}
