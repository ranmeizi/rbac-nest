import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResService } from 'src/res/res.service';

@Catch()
export class ErrorHandlerFilter<T> implements ExceptionFilter {
  constructor(private readonly res: ResService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // 如果是 HttpException，则提取状态码和错误信息
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    }

    // 返回统一的错误响应格式
    response.status(status).json(this.res.catchError(message));
  }
}
