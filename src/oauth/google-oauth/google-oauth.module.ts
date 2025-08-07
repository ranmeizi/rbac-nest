import { Module } from '@nestjs/common';
import { GoogleOauthService } from './google-oauth.service';
import { GoogleOauthController } from './google-oauth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2GoogleEntity } from 'src/entities/oa_google.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([OAuth2GoogleEntity]),
  ],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthService],
  exports: [GoogleOauthService, TypeOrmModule.forFeature([OAuth2GoogleEntity])],
})
export class GoogleOauthModule {}
