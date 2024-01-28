import { LogInfo } from '@/models/LogInfo';
import { NEXT_APP_LOG_NAME, NEWRELIC_LOG_KEY } from '@/models/constants';
import { _LoggerBase } from './_LoggerBase';

export class Logger extends _LoggerBase {
  constructor() {
    super();
  }

  public static async _genericLog(logData: LogInfo) {
    try {
      const service = logData.fromClient
        ? `${NEXT_APP_LOG_NAME}-client`
        : NEXT_APP_LOG_NAME;

      if (!NEWRELIC_LOG_KEY) {
        console.error('Missing NEWRELIC_LOG_KEY');
        console.log(logData);
        return;
      }

      const newRelicBody = JSON.stringify({
        service,
        severity: logData.severity,
        method: logData.method,
        logs: [
          {
            timestamp: Date.now(),
            message: logData.message,
            attributes: { customProperties: logData },
          },
        ],
      });

      const headers = {
        'Content-Type': 'application/json',
        'Api-Key': NEWRELIC_LOG_KEY as string,
      };

      const options: RequestInit = {
        method: 'POST',
        headers,
        body: newRelicBody,
      };

      const res = await fetch('https://log-api.newrelic.com/log/v1', options);
      if (!res.ok) {
        try {
          const msg = await res.text();
          console.error('Error sending logs - 1', msg);
        } catch (resTextError) {
          console.error('Error sending logs - 2', resTextError);
        }
      }
    } catch (error) {
      console.error('Error sending logs - 3', error);
    }
  }
}
