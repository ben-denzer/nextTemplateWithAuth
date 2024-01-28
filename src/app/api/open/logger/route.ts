import {
  SUCCESS_RESPONSE,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import resError from '@/utils/backend/resError';
import resSuccess from '@/utils/backend/resSuccess';
import { Logger } from '@/utils/logger/Logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    Logger._genericLog(body);
    return resSuccess(zSuccessResponse, SUCCESS_RESPONSE);
  } catch (error) {
    return resError(req, error);
  }
}
