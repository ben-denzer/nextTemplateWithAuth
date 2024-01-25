export type LogMetadata = Record<'data', any>;

interface LogInfo {
  method: string;
  message: string;
  severity: 0 | 1 | 2 | 3 | 4;
  metadata?: LogMetadata;
  errName?: string;
  errMessage?: string;
  errStack?: string;
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

  public static error(method: string, message: string, error: unknown, metadata: LogMetadata = { data: {} }) {
    const errorInfo = Logger.getErrorInfo(error);
    const metadataWithError: LogMetadata = { data: { ...metadata.data, errorInfo } };

    // Auth errors do not belong as severity 3
    if (errorInfo.errName === ErrorCodes.AUTH_ERROR) {
      Logger.genericLog({ method, message, severity: 1, metadata: metadataWithError });
      return;
    }

    Logger.genericLog({ method, message, severity: 3, metadata: metadataWithError });
  }

  public static fatal(method: string, message: string, error: unknown, metadata: LogMetadata = { data: {} }) {
    const errorInfo = Logger.getErrorInfo(error);
    const metadataWithError: LogMetadata = { data: { ...metadata.data, errorInfo } };

    // Auth errors do not belong as severity 4
    if (errorInfo.errName === ErrorCodes.AUTH_ERROR) {
      Logger.genericLog({ method, message, severity: 1, metadata: metadataWithError });
      return;
    }

    Logger.genericLog({ method, message, severity: 4, metadata: metadataWithError });
  }

  private static getErrorInfo(error: unknown): { errName?: string; errMessage?: string; errStack?: string } {
    if (error instanceof Error) {
      return {
        errName: error.name,
        errMessage: error.message,
        errStack: error.stack,
      };
    } else {
      return Logger.getErrorInfo(new Error('unknown error'));
    }
  }

  private static genericLog(logData: LogInfo) {
    // TODO: implement
    console.log(logData);
    return;
  }
}
