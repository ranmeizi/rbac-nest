import { Body, Controller, Post } from '@nestjs/common';
import { GoogleOauthService } from './google-oauth.service';

@Controller('oauth/google')
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}
}
