import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db';
import { PermissionModule } from './rbac/permission/permission.module';
import { UserModule } from './rbac/user/user.module';
import { RoleModule } from './rbac/role/role.module';

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
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
