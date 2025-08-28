import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

// 加载对应环境的 .env 文件
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

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

  // 配置 CORS
  app.enableCors({
    origin: '*', // 允许所有来源，生产环境建议指定域名
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
