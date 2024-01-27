import { AUTH_TOKEN_COOKIE_NAME } from '@/models/constants';
import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import { LogMetadata, Logger } from '@/utils/logger/Logger';
import { cookies } from 'next/headers';
import { prisma } from '@/utils/backend/prisma';

export async function POST(req: Request) {
  const method = 'POST /api/open/auth/logout';
  const metadata: LogMetadata = {};
  try {
    Logger.triggered(method, metadata);

    const token = cookies().get(AUTH_TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      Logger.debug(method, 'no auth token found', metadata);
      return resSuccess(zSuccessResponse, SUCCESS_RESPONSE, 200);
    }

    cookies().delete(AUTH_TOKEN_COOKIE_NAME);
    Logger.debug(method, 'auth cookie deleted', metadata);

    try {
      await prisma.authToken.delete({
        where: {
          token,
        },
      });
    } catch (error) {
      // cookie has been deleted - no need to show this DB error to the user, but we should log it
      Logger.error(
        method,
        'failed to delete auth token from database',
        error,
        metadata
      );
    }

    Logger.success(method, metadata);
    return resSuccess(zSuccessResponse, SUCCESS_RESPONSE, 200);
  } catch (error: any) {
    Logger.error(method, 'logout failed', error, metadata);
    return resError(req, error);
  }
}
