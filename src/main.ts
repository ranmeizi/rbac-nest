import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // 自动剔除未定义在 DTO 中的属性
      forbidNonWhitelisted: false, // 如果传入了未定义的属性，抛出错误
      transform: false, // 自动转换参数类型
    }),
  );

  await app.listen(3000);
}
bootstrap();
