import { AUTH_TOKEN_COOKIE_NAME } from '@/models/constants';
import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import { LogMetadata, Logger } from '@/utils/logger/Logger';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const method = 'POST /api/open/auth/logout';
  const metadata: LogMetadata = {};
  try {
    Logger.triggered(method, metadata);

    cookies().delete(AUTH_TOKEN_COOKIE_NAME);
    Logger.debug(method, 'auth token deleted', metadata);

    return resSuccess(zSuccessResponse, SUCCESS_RESPONSE, 200);
  } catch (error: any) {
    Logger.error(method, 'logout failed', error, metadata);
    return resError(req, error);
  }
}
