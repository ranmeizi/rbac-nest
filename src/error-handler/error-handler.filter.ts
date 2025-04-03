import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResService } from 'src/res/res.service';

@Catch()
export class ErrorHandlerFilter<T> implements ExceptionFilter {
  constructor(private readonly res: ResService) { }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errors = null;

    let code = this.res.Codes.InternalError;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // 如果是 HttpException，则提取状态码和错误信息
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理 class-validator 的验证错误
      if (exception instanceof BadRequestException) {
        status = HttpStatus.OK;
        code = this.res.Codes.BadRequest;
        const validationErrors = (exceptionResponse as any).message || [];
        errors = validationErrors;
        message = '请求参数验证失败';
        console.log('bad??');
      } else {
        message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || message;
        errors = exception.message;
      }
    } else {
      console.log('什么？没拦截住？');

      // TODO 业务错误应该创建自己的 Exception 类型 传递 code message data 进来 这里是兜底

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      errors = exception?.message;
    }

    // 返回统一的错误响应格式
    response.status(status).json(this.res.error(code, message, errors));
  }
}
