import { Controller, Get, Headers, Query, Req, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { DecodeVerifyParams, EmailCallbackContext } from './dto/email.dto';
import { OnceContextService } from '../once_context/once_context.service';
import { Response } from 'express';
import { URLSearchParams } from 'url';
import { decryptSearch } from './crypto.util';
import { BusinessException } from 'src/error-handler/BusinessException';
import { ResService } from 'src/res/res.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly onceContextService: OnceContextService,
    private readonly emailService: EmailService,
  ) {}

  // 支持快速登陆的验证
  @Get('/callback')
  async callbackBeta(
    @Query() { z }: { z: string },
    @Res() res: Response,
    @Headers('User-Agent') ua: string,
  ) {
    try {
      // 解析参数
      const { code } = decryptSearch(z) as DecodeVerifyParams;

      const context: EmailCallbackContext = await this.onceContextService.get(
        code,
      );

      // 执行 注册/绑定
      const { params } = await this.emailService.handleCallback(context, ua);

      const url = await this.emailService.finishEmailVerifyRedirect(params);

      // 一般重定向(静态页)
      return res.redirect(301, url);
    } catch (e) {
      console.log('email verify error:', e);
      throw new BusinessException('链接已失效', ResService.CODES.BadRequest);
    }
  }
}
