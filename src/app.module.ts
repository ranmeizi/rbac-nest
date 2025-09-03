import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db';
import { ResModule } from './res/res.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { CrudModule } from './utils/crud/crud.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './utils/email/email.module';
import { RbacModule } from './RBAC/rbac.module';
import { GoogleOauthModule } from './oauth/google-oauth/google-oauth.module';
import { OnceContextModule } from './utils/once_context/once_context.module';
import { OssModule } from './oss/oss.module';
import { WeatherModule } from './weather/weather.module';
import { WallpaperModule } from './wallpaper/wallpaper.module';

@Module({
  imports: [
    // 配置模块 - 加载环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // TypeORM 模块 - 使用 DataSource 配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOptions,
        migrations: [],
        autoLoadEntities: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    RbacModule,
    ResModule, // 通用响应体
    ErrorHandlerModule, // 错误处理
    CrudModule,
    AuthModule,
    OssModule,
    WeatherModule,
    EmailModule,
    WallpaperModule,
    GoogleOauthModule,
    OnceContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
