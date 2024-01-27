import { SALT_ROUNDS } from '@/models/constants';
import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import validateReqBody from '@/utils/backend/validateReqBody';
import bcrypt from 'bcrypt';
import { prisma } from '@/utils/backend/prisma';
import {
  authCookieOptions,
  cleanupAuthTokens,
  generateAuthToken,
} from '@/utils/backend/authToken';
import { cookies } from 'next/headers';
import { LogMetadata, Logger } from '@/utils/logger/Logger';
import { wait } from '@/utils/helpers/wait';
import {
  ResetPasswordPayload,
  zResetPasswordPayload,
} from '@/models/requestPayloads/auth/ResetPassword';
import { AuthError } from '@/models/errors/AuthError';
import { InvalidRequestPayloadError } from '@/models/errors/InvalidRequestPayloadError';

type RequestBody = ResetPasswordPayload;
const zRequestType = zResetPasswordPayload;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  const method = 'POST /api/open/auth/resetPassword';
  const metadata: LogMetadata = {};
  try {
    await wait(1);
    Logger.triggered(method, metadata);

    const body: RequestBody = await req.json();
    metadata.body = { ...body, password: '***', password2: '***' };
    Logger.info(method, 'pw reset request', metadata);

    validateReqBody(zRequestType, body);

    if (body.password !== body.password2) {
      throw new InvalidRequestPayloadError('Passwords do not match');
    }

    const tokenRes = await prisma.authToken.findFirst({
      where: {
        token: body.token,
        tokenType: 'forgotPassword',
      },
      select: {
        userId: true,
      },
    });

    if (!tokenRes) {
      throw new AuthError('Invalid token');
    }

    const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);

    Logger.debug(method, 'password hashed', metadata);

    const userAuthRecord = await prisma.userAuth.update({
      data: {
        password: hashed,
      },
      where: {
        id: tokenRes.userId,
      },
    });
    Logger.debug(method, 'userAuth record updated, clearing tokens', metadata);

    await cleanupAuthTokens(tokenRes.userId);

    const authToken = await generateAuthToken({
      userId: userAuthRecord.id,
      tokenType: 'login',
    });

    cookies().set(authCookieOptions(authToken));

    Logger.success(method, metadata);
    return resSuccess(zResponseType, SUCCESS_RESPONSE);
  } catch (error: any) {
    Logger.error(method, 'password update failed', error, metadata);
    return resError(req, error);
  }
}
