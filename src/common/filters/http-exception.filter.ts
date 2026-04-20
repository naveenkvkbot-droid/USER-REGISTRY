import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorCode = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as Record<string, unknown>;
      errorCode =
        (resp.code as string) ||
        (resp.error as string) ||
        this.getErrorCodeFromStatus(status);
      message = (resp.message as string) || message;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      errorCode = this.getErrorCodeFromStatus(status);
    }

    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - ${status} [${errorCode}]: ${message}`,
      exception.stack,
    );

    response.status(status).json({
      data: null,
      error: {
        code: errorCode,
        message,
      },
    });
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case 400:
        return 'VALIDATION_FAILED';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'USER_NOT_FOUND';
      case 409:
        return 'DUPLICATE_FACE';
      case 422:
        return 'INVALID_EMBEDDING_DIMENSION';
      case 500:
        return 'DATABASE_ERROR';
      case 503:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'INTERNAL_ERROR';
    }
  }
}
