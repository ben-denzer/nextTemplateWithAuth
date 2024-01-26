import { zLoginRequest } from '@/models/requestPayloads/auth/LoginRequest';
import { SUCCESS_RESPONSE, zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import validateReqBody from '@/utils/backend/validateReqBody';

const zRequestType = zLoginRequest;
const zResponseType = zSuccessResponse;

export async function POST(req: Request) {
  try {
    validateReqBody(zRequestType, await req.json());

    return resSuccess(zResponseType, SUCCESS_RESPONSE);
  } catch (error) {
    return resError(req, error);
  }
}
