import { LogInfo, zLogInfo } from '@/models/LogInfo';
import fetchWrapper from '../frontend/fetchWrapper';
import { ApiRoutes } from '@/models/routes';
import {
  SuccessResponse,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import { _LoggerBase } from './_LoggerBase';

export class ClientLogger extends _LoggerBase {
  constructor() {
    super();
  }

  public static async _genericLog(logData: LogInfo) {
    try {
      const res = await fetchWrapper<SuccessResponse>(
        'POST',
        ApiRoutes.LOGGER,
        logData,
        {
          zRequestType: zLogInfo,
          zResponseType: zSuccessResponse,
        }
      );
      if (!res.success) {
        console.error('Error sending logs - 1', res);
      }
    } catch (error) {
      console.error('Error sending logs - 2', error);
    }
  }
}
