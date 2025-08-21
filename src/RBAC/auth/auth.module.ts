import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { EmailService } from 'src/utils/email/email.service';
import { EmailModule } from 'src/utils/email/email.module';
import { GoogleOauthModule } from 'src/oauth/google-oauth/google-oauth.module';
import { OnceContextModule } from 'src/utils/once_context/once_context.module';
import { JwtStrategy } from 'src/guards/jwt/jwt.guard';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    forwardRef(() => EmailModule),
    forwardRef(() => GoogleOauthModule),
    forwardRef(() => OnceContextModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
