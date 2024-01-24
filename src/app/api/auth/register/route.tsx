import { SALT_ROUNDS } from '@/models/constants';
import { SignupRequest, zSignupRequest } from '@/models/requestPayloads/auth/SignupRequest';
import { SUCCESS_RESPONSE, zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import validateReqBody from '@/utils/backend/validateReqBody';
import bcrypt from 'bcrypt';
import prisma from '@/utils/backend/db';

type RequestBody = SignupRequest;
const zRequestType = zSignupRequest;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    validateReqBody(zRequestType, body);

    const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);

    try {
      await prisma.userAuth.create({
        data: {
          email: body.email,
          password: hashed,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }

    return resSuccess(zResponseType, SUCCESS_RESPONSE);
  } catch (error) {
    return resError(req, error);
  }
}
