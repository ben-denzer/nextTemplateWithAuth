import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import validateReqBody from '@/utils/backend/validateReqBody';
import { prisma } from '@/utils/backend/prisma';
import { generateAuthToken } from '@/utils/backend/authToken';
import { LogMetadata, Logger } from '@/utils/logger/Logger';
import { ConflictError } from '@/models/errors/ConflictError';
import { EmailOnly, zEmailOnly } from '@/models/requestPayloads/auth/EmailOnly';
import { wait } from '@/utils/helpers/wait';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { BASE_URL } from '@/models/constants';
import { PageRoutes } from '@/models/routes';

const mailgun = new Mailgun(FormData as any);
const DOMAIN = process.env.MAILGUN_DOMAIN as string;
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY as string,
});

type RequestBody = EmailOnly;
const zRequestType = zEmailOnly;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  const method = 'POST /api/open/auth/forgotPassword';
  const metadata: LogMetadata = {};
  try {
    await wait(1);
    Logger.triggered(method, metadata);

    const body: RequestBody = await req.json();
    metadata.body = body;
    Logger.info(method, 'forgot password request', metadata);

    validateReqBody(zRequestType, body);

    const userAuthRecord = await prisma.userAuth.findUnique({
      where: {
        username: body.email,
      },
      select: {
        id: true,
      },
    });

    if (!userAuthRecord) {
      Logger.debug(method, 'user not found - sending 200', metadata);
      return resSuccess(zResponseType, SUCCESS_RESPONSE);
    }

    const forgotPwToken = await generateAuthToken({
      userId: userAuthRecord.id,
      tokenType: 'forgotPassword',
    });

    const resetLink = `${BASE_URL}${PageRoutes.PASSWORD_RESET}?email=${body.email}&token=${forgotPwToken}`;
    metadata.resetLink = resetLink;

    Logger.debug(method, 'reset link generated', metadata);

    await mg.messages.create(DOMAIN, {
      from: 'no-reply@bdenzer.com',
      to: body.email,
      subject: 'Reset your password',
      html: `<p>Click this link to reset your password. It is valid for 72 hours: <a href="${resetLink}">${resetLink}</a></p>`,
    });

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
