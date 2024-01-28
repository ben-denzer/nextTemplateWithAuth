import {
  LoginRequest,
  zLoginRequest,
} from '@/models/requestPayloads/auth/LoginRequest';
import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import validateReqBody from '@/utils/backend/validateReqBody';
import { Logger } from '@/utils/logger/Logger';
import { prisma } from '@/utils/backend/prisma';
import bcrypt from 'bcrypt';
import { AuthError } from '@/models/errors/AuthError';
import {
  authCookieOptions,
  cleanupAuthTokens,
  generateAuthToken,
} from '@/utils/backend/authToken';
import { cookies } from 'next/headers';
import { wait } from '@/utils/helpers/wait';
import { LogMetadata } from '@/models/LogInfo';

type RequestBody = LoginRequest;
const zRequestType = zLoginRequest;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  const method = 'POST /api/open/auth/login';
  const metadata: LogMetadata = {};
  try {
    await wait(1);
    Logger.triggered(method, metadata);

    const body: RequestBody = await req.json();
    metadata.body = { ...body, password: '***' };
    Logger.info(method, 'login request', metadata);

    validateReqBody(zRequestType, body);

    const userAuthRecord = await prisma.userAuth.findUnique({
      where: {
        username: body.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!userAuthRecord) {
      throw new AuthError('User not found');
    }

    const passwordMatches = await bcrypt.compare(
      body.password,
      userAuthRecord.password
    );

    if (!passwordMatches) {
      throw new AuthError('Password does not match');
    }

    try {
      await cleanupAuthTokens(userAuthRecord.id);
    } catch (error) {
      // user does not need to worry about this, but we should log it
      Logger.error(method, 'cleanupAuthTokens failed', { error });
    }

    const authToken = await generateAuthToken({
      userId: userAuthRecord.id,
      tokenType: 'login',
    });
    cookies().set(authCookieOptions(authToken));

    Logger.success(method, metadata);
    return resSuccess(zResponseType, SUCCESS_RESPONSE);
  } catch (error) {
    return resError(req, error);
  }
}
