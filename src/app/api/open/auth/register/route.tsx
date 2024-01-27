import { SALT_ROUNDS } from '@/models/constants';
import {
  SignupRequest,
  zSignupRequest,
} from '@/models/requestPayloads/auth/SignupRequest';
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
  generateAuthToken,
} from '@/utils/backend/authToken';
import { cookies } from 'next/headers';
import { LogMetadata, Logger } from '@/utils/logger/Logger';
import { ConflictError } from '@/models/errors/ConflictError';
import { wait } from '@/utils/helpers/wait';

type RequestBody = SignupRequest;
const zRequestType = zSignupRequest;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  const method = 'POST /api/open/auth/register';
  const metadata: LogMetadata = {};
  try {
    await wait(1);
    Logger.triggered(method, metadata);

    const body: RequestBody = await req.json();
    metadata.body = { ...body, password: '***', password2: '***' };
    Logger.info(method, 'signup request', metadata);

    validateReqBody(zRequestType, body);

    const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);

    Logger.debug(method, 'password hashed', metadata);

    const userAuthRecord = await prisma.userAuth.create({
      data: {
        username: body.email,
        password: hashed,
      },
    });
    Logger.debug(method, 'userAuth record created', metadata);

    const authToken = await generateAuthToken({
      userId: userAuthRecord.id,
      tokenType: 'login',
    });

    cookies().set(authCookieOptions(authToken));

    Logger.success(method, metadata);
    return resSuccess(zResponseType, SUCCESS_RESPONSE);
  } catch (error: any) {
    Logger.error(method, 'signup failed', error, metadata);
    if (error.code === 'P2002') {
      return resError(req, new ConflictError('Email already in use'));
    }
    return resError(req, error);
  }
}
