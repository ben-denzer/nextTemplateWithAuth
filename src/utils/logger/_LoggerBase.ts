import { LogInfo, LogMetadata } from '@/models/LogInfo';
import { AuthError } from '@/models/errors/AuthError';

export class _LoggerBase {
  public static triggered(method: string, metadata?: LogMetadata) {
    this._genericLog({ method, message: 'triggered', severity: 1, metadata });
  }

  public static success(method: string, metadata?: LogMetadata) {
    this._genericLog({ method, message: 'success', severity: 1, metadata });
  }

  public static debug(method: string, message: string, metadata?: LogMetadata) {
    this._genericLog({ method, message, severity: 0, metadata });
  }

  public static info(method: string, message: string, metadata?: LogMetadata) {
    this._genericLog({ method, message, severity: 1, metadata });
  }

  public static warn(method: string, message: string, metadata?: LogMetadata) {
    this._genericLog({ method, message, severity: 2, metadata });
  }

  public static error(
    method: string,
    message: string,
    error: unknown,
    metadata: LogMetadata = { data: {} }
  ) {
    const errorInfo = this.getErrorInfo(error);
    const metadataWithError: LogMetadata = {
      data: { ...metadata.data, errorInfo },
    };

    // Auth errors do not belong as severity 3
    if (error instanceof AuthError) {
      this._genericLog({
        method,
        message,
        severity: 0,
        metadata: metadataWithError,
      });
      return;
    }

    this._genericLog({
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
    const errorInfo = this.getErrorInfo(error);
    const metadataWithError: LogMetadata = {
      data: { ...metadata.data, errorInfo },
    };

    // Auth errors do not belong as severity 4
    if (error instanceof AuthError) {
      this._genericLog({
        method,
        message,
        severity: 0,
        metadata: metadataWithError,
      });
      return;
    }

    this._genericLog({
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
      return this.getErrorInfo(new Error('unknown error'));
    }
  }

  public static async _genericLog(_logData: LogInfo) {
    throw new Error(
      'Not implemented - Do not use _LoggerBase directly. Use ClientLogger or Logger.'
    );
  }
}
