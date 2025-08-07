import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { EmailService } from 'src/utils/email/email.service';
import { EmailModule } from 'src/utils/email/email.module';
import { GoogleOauthModule } from 'src/oauth/google-oauth/google-oauth.module';

@Module({
  imports: [UsersModule, RolesModule, EmailModule, GoogleOauthModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, EmailService],
})
export class AuthModule {}
