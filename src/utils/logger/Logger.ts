import { LOG_APP_NAME, NEWRELIC_LOG_KEY } from '@/models/constants';
import { AuthError } from '@/models/errors/AuthError';

export type LogMetadata = Record<string, any>;

interface LogInfo {
  method: string;
  message: string;
  severity: 0 | 1 | 2 | 3 | 4;
  metadata?: LogMetadata;
  errName?: string;
  errMessage?: string;
  errStack?: string;
  errCode?: string;
}

export class Logger {
  public static triggered(method: string, metadata?: LogMetadata) {
    Logger.genericLog({ method, message: 'triggered', severity: 1, metadata });
  }

  public static success(method: string, metadata?: LogMetadata) {
    Logger.genericLog({ method, message: 'success', severity: 1, metadata });
  }

  public static debug(method: string, message: string, metadata?: LogMetadata) {
    Logger.genericLog({ method, message, severity: 0, metadata });
  }

  public static info(method: string, message: string, metadata?: LogMetadata) {
    Logger.genericLog({ method, message, severity: 1, metadata });
  }

  public static warn(method: string, message: string, metadata?: LogMetadata) {
    Logger.genericLog({ method, message, severity: 2, metadata });
  }

  public static error(
    method: string,
    message: string,
    error: unknown,
    metadata: LogMetadata = { data: {} }
  ) {
    const errorInfo = Logger.getErrorInfo(error);
    const metadataWithError: LogMetadata = {
      data: { ...metadata.data, errorInfo },
    };

    // Auth errors do not belong as severity 3
    if (error instanceof AuthError) {
      Logger.genericLog({
        method,
        message,
        severity: 0,
        metadata: metadataWithError,
      });
      return;
    }

    Logger.genericLog({
      method,
      message,
      severity: 3,
      metadata: metadataWithError,
    });
  }

  public static fatal(
    method: string,
    message: string,
    error: unknown,
    metadata: LogMetadata = { data: {} }
  ) {
    const errorInfo = Logger.getErrorInfo(error);
    const metadataWithError: LogMetadata = {
      data: { ...metadata.data, errorInfo },
    };

    // Auth errors do not belong as severity 4
    if (error instanceof AuthError) {
      Logger.genericLog({
        method,
        message,
        severity: 0,
        metadata: metadataWithError,
      });
      return;
    }

    Logger.genericLog({
      method,
      message,
      severity: 4,
      metadata: metadataWithError,
    });
  }

  private static getErrorInfo(error: unknown): {
    errName?: string;
    errMessage?: string;
    errStack?: string;
    errCode?: string;
  } {
    if (error instanceof Error) {
      return {
        errName: error.name,
        errMessage: error.message,
        errStack: error.stack,
        errCode: (error as any).code?.toString(),
      };
    } else {
      return Logger.getErrorInfo(new Error('unknown error'));
    }
  }

  private static async genericLog(logData: LogInfo) {
    try {
      const newRelicBody = JSON.stringify({
        service: LOG_APP_NAME,
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
