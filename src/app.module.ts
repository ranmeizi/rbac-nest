import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db';
import { UsersModule } from './RBAC/users/users.module';
import { RolesModule } from './RBAC/roles/roles.module';
import { PermissionsModule } from './RBAC/permissions/permissions.module';
import { ResModule } from './res/res.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { CrudModule } from './utils/crud/crud.module';
import { AuthModule } from './auth/auth.module';
import { WallpaperModule } from './wallpaper/wallpaper.module';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt/jwt.guard';
import { OssModule } from './oss/oss.module';
import { WeatherModule } from './weather/weather.module';
import { EmailModule } from './utils/email/email.module';
import { RbacModule } from './RBAC/rbac.module';
import { UsersService } from './rbac/users/users.service';
import { RolesService } from './rbac/roles/roles.service';
import { PermissionsService } from './rbac/permissions/permissions.service';

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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    WallpaperModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    RbacModule,
    ResModule, // 通用响应体
    ErrorHandlerModule, // 错误处理
    CrudModule,
    AuthModule,
    OssModule,
    WeatherModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    UsersService,
    RolesService,
    PermissionsService,
  ],
})
export class AppModule {}
