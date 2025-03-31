import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorHandlerFilter } from './error-handler.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHandlerFilter, // 注册全局异常过滤器
    },
  ],
})
export class ErrorHandlerModule {}
