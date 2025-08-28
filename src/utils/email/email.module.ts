import { forwardRef, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyCode } from 'src/entities/verify_code.entity';
import { VerifyCodeLog } from 'src/entities/verify_code_log.entity';
import { EmailController } from './email.controller';
import { AuthModule } from 'src/rbac/auth/auth.module';
import { UsersModule } from 'src/rbac/users/users.module';
import { GoogleOauthModule } from 'src/oauth/google-oauth/google-oauth.module';
import { OnceContextModule } from '../once_context/once_context.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerifyCode, VerifyCodeLog]),
    UsersModule,
    forwardRef(() => AuthModule),
    forwardRef(() => GoogleOauthModule),
    OnceContextModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
