import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db';
import { ResModule } from './res/res.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { CrudModule } from './utils/crud/crud.module';
import { AuthModule } from './rbac/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt/jwt.guard';
import { EmailModule } from './utils/email/email.module';
import { RbacModule } from './RBAC/rbac.module';
import { UsersService } from './rbac/users/users.service';
import { RolesService } from './rbac/roles/roles.service';
import { PermissionsService } from './rbac/permissions/permissions.service';
import { GoogleOauthModule } from './oauth/google-oauth/google-oauth.module';
import { OnceContextModule } from './utils/once_context/once_context.module';

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
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT 密钥
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // 令牌有效期
    }),
    RbacModule,
    ResModule, // 通用响应体
    ErrorHandlerModule, // 错误处理
    CrudModule,
    AuthModule,
    EmailModule,
    GoogleOauthModule,
    OnceContextModule,
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
