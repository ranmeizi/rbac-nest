import { Body, Controller, Post } from '@nestjs/common';
import { GoogleOauthService } from './google-oauth.service';

@Controller('oauth/google')
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}

  // /**
  //  * 快捷登录
  //  */
  // @Post('/fastSignIn')
  // async fastSignIn(@Body() fastSignInDto: FastSignInDto) {
  //   const res = await this.googleOauthService.getAccessToken(
  //     fastSignInDto.code,
  //   );

  //   const profile = await this.googleOauthService.getProfile(res.id_token);

  //   // 检查 google_account 表有无数据

  //   // 没有 但是 邮箱一样，询问是否进行邮箱认证绑定。

  //   // 调用登陆

  //   return 'hi';
  // }

  // /**
  //  *  快捷注册
  //  */
  // @Post('/fastSignUp')
  // async fastSignUp(@Body() fastSignUpDto: FastSignUnDto) {
  //   const res = await this.googleOauthService.getAccessToken(
  //     fastSignUpDto.code,
  //   );

  //   const profile = await this.googleOauthService.getProfile(res.id_token);

  //   // 检查 google_account 表有无数据

  //   // 有,去登陆或解绑 返回 001

  //   // 存入临时表 生成 code

  //   // 将code 返回给前端，调用注册
  // }
}
