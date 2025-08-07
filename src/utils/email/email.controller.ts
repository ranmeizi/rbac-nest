import { Controller, Get, Headers, Query, Req, Res } from '@nestjs/common';
import { ResService } from 'src/res/res.service';
import { EmailService } from './email.service';
import {
  DecodeVerifyParams,
  EmailVerifyContext,
  EnumEVCType,
} from './dto/email.dto';
import { OnceContextService } from '../once_context/once_context.service';
import { Response } from 'express';
import { URLSearchParams } from 'url';

@Controller('email')
export class EmailController {
  constructor(
    private readonly usersService: EmailService,
    private readonly res: ResService,
    private readonly onceContextService: OnceContextService,
    private readonly emailServices: EmailService,
  ) {}

  // 简单验证
  @Get('/verify')
  async callback(
    @Query() { z }: { z: string },
    @Res() res: Response,
    @Headers('User-Agent') ua: string,
  ) {
    // 解析参数
    const { code } = this.usersService._decryptSearch(z) as DecodeVerifyParams;

    const context: EmailVerifyContext = await this.onceContextService.get(code);

    // 执行 注册/绑定
    const { params } = await this.emailServices.handleEmailVerifyCallback(
      context,
      ua,
    );

    const url = await this.emailServices.finishEmailVerifyRedirect(
      new URLSearchParams(),
    );

    // 一般重定向(静态页)
    return res.redirect(301, url);
  }

  // 支持快速登陆的验证
  @Get('/verify/beta')
  async callbackBeta(
    @Query() { z }: { z: string },
    @Res() res: Response,
    @Headers('User-Agent') ua: string,
  ) {
    // 解析参数
    const { code } = this.usersService._decryptSearch(z) as DecodeVerifyParams;

    const context: EmailVerifyContext = await this.onceContextService.get(code);

    // 执行 注册/绑定
    const { params } = await this.emailServices.handleEmailVerifyCallback(
      context,
      ua,
    );

    const url = await this.emailServices.finishEmailVerifyRedirect(params);

    // 一般重定向(静态页)
    return res.redirect(301, url);
  }
}
