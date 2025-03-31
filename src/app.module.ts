import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db';
import { UsersModule } from './rbac/users/users.module';
import { RolesModule } from './rbac/roles/roles.module';
import { PermissionsModule } from './rbac/permissions/permissions.module';
import { ResModule } from './res/res.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';

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
    UsersModule,
    RolesModule,
    PermissionsModule,
    ResModule, // 通用响应体
    ErrorHandlerModule, // 错误拦截
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
