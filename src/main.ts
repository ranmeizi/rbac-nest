import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { SignInterceptor } from './interceptors/sign/sign.interceptors';
import { json, urlencoded } from 'express';
import * as multer from 'multer';

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

  const upload = multer().any(); // 或者 .none() 如果不处理文件

  app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      // 解析 FormData
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: 'File upload error' });
        }
        next();
      });
    } else {
      next();
    }
  });

  app.useGlobalInterceptors(new SignInterceptor());

  // 配置 CORS
  app.enableCors({
    origin: '*', // 允许所有来源，生产环境建议指定域名
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
