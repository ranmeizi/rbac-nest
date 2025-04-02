import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { importWallpapers } from 'scripts/import-wallpapers'
async function bootstrap() {
  console.log(process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_DATABASE)
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    // new ValidationPipe({
    //   whitelist: true, // 自动剔除未定义在 DTO 中的属性
    //   forbidNonWhitelisted: true, // 如果传入了未定义的属性，抛出错误
    //   transform: true, // 自动转换参数类型
    // }),
  );

  await app.listen(3000);
}
bootstrap();
