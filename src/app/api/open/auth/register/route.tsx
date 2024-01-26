import { SALT_ROUNDS } from '@/models/constants';
import { SignupRequest, zSignupRequest } from '@/models/requestPayloads/auth/SignupRequest';
import { SUCCESS_RESPONSE, zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import validateReqBody from '@/utils/backend/validateReqBody';
import bcrypt from 'bcrypt';
import prisma from '@/utils/backend/db';
import { authCookieOptions, generateAuthToken } from '@/utils/backend/authToken';
import { cookies } from 'next/headers';
import { LogMetadata, Logger } from '@/utils/logger/Logger';

type RequestBody = SignupRequest;
const zRequestType = zSignupRequest;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  const method = 'POST /api/auth/register';
  const metadata: LogMetadata = {};
  try {
    Logger.triggered(method, metadata);

    const body: RequestBody = await req.json();
    validateReqBody(zRequestType, body);

    metadata.body = { ...body, password: '***', password2: '***' };
    const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);

    Logger.debug(method, 'password hashed', metadata);

    const userAuthRecord = await prisma.userAuth.create({
      data: {
        email: body.email,
        password: hashed,
      },
    });

    const authToken = await generateAuthToken({ userId: userAuthRecord.id });
    cookies().set(authCookieOptions(authToken));
    return resSuccess(zResponseType, SUCCESS_RESPONSE);
  } catch (error: any) {
    Logger.error(method, 'signup failed', error, metadata);
    if (error.code === 'P2002') {
      return resError(req, error, 409);
    }
    return resError(req, error);
  }
}
