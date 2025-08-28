import {
  Body,
  Controller,
  forwardRef,
  Headers,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResService } from 'src/res/res.service';
import { CodeLoginDto, LoginDto } from './dto/login.dto';
import { EmailService } from 'src/utils/email/email.service';
import { BusinessException } from 'src/error-handler/BusinessException';
import { UsersService } from '../users/users.service';
import {
  EnumVerifyCodeOperate,
  EnumVerifyCodeType,
} from 'src/entities/verify_code.entity';
import { GoogleFastSignInDto } from 'src/oauth/google-oauth/dto/oauth2.dto';
import { GoogleOauthService } from 'src/oauth/google-oauth/google-oauth.service';
import { EmailSignupDto, SendEmailDto } from './dto/email-signup.dto';
import { UserDto } from '../users/dto/expose-user.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import {
  ChangePasswordDto,
  ForgotChangePasswordDto,
} from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly res: ResService,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly googleOauthService: GoogleOauthService,
  ) {}

  /** 用户登录 */
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return this.res.success(result);
  }

  @Post('/refreshToken')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return this.res.success(result);
  }

  @Post('/logout')
  async logout() {
    // TODO : 如果需要的话
    return '';
  }

  @Post('/sendEmailCode')
  async sendEmail(@Body() { email }: SendEmailDto, @Req() req: any) {
    // 获取IP地址
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req?.ip ||
      req?.socket?.remoteAddress ||
      '';
    // 生成验证码
    const code = await this.emailService.genCode(ip);
    // 尝试发邮件
    await this.emailService.sendEmailCode(email, code);

    // 插入记录表
    await this.emailService.insertCode({
      code,
      type: EnumVerifyCodeType.邮箱,
      operate: EnumVerifyCodeOperate.注册,
      ip,
      target: email,
    });

    return this.res.success('');
  }

  @Post('/emailsignup')
  async signup(@Body() emailSignupDto: EmailSignupDto) {
    // 校验code
    if (
      !(await this.emailService.verify(
        emailSignupDto.email,
        emailSignupDto.verifyCode,
      ))
    ) {
      throw new BusinessException(`验证码错误`, ResService.CODES.BadRequest);
    }

    // 创建用户
    await this.userService.create({
      username: emailSignupDto.email,
      email: emailSignupDto.email,
      password: emailSignupDto.password,
    });

    return this.res.success('');
  }

  @Post('/google-login')
  async googleLogin(
    @Body() { code }: GoogleFastSignInDto,
    @Headers('user-agent') ua: string,
  ) {
    const profile = await this.googleOauthService.getProfile(code);

    // 检查 google 邮箱有没有校验
    if (!profile.email_verified) {
      // 没有邮箱认证的 google 账号不能用
      throw new BusinessException(
        '您的google账户邮箱未认证,请在google进行邮箱认证后方可使用google登陆',
        ResService.CODES.BadRequest,
      );
    }

    // 检查 google_account 表有无数据
    const googleAccount =
      await this.googleOauthService.findGoogleAccountByGoogleSub(profile.sub);

    // 有无 user
    const user = await this.userService.findByEmail(profile.email);

    if (!googleAccount) {
      if (!user) {
        // 无数据 调用注册
        await this.emailService.__prevent_abuse__googleOAuthFastSignUpSendEmail(
          {
            profile,
            ua,
          },
        );
        // 终止
        throw new BusinessException(
          '还没有注册,请打开您google绑定邮箱接收验证邮件后方可登录',
          ResService.CODES.OAuthFastSignInNeedVerifyEmail,
        );
      } else {
        // 无数据 调用email校验绑定
        await this.emailService.__prevent_abuse__googleOAuthBindAccountSendEmail(
          {
            profile,
            ua,
          },
        );
        // 终止
        throw new BusinessException(
          '该Email已注册,请打开您google绑定邮箱接收验证邮件后绑定登陆',
          ResService.CODES.OAuthFastSignInNeedVerifyEmail,
        );
      }
    }

    // 登陆成功
    return this.res.success(
      await this.authService.__prevent_abuse__OAuthSignToken(user),
    );
  }

  /**
   * 1.code 由 ？？？ 发放(单次登录)
   * 2.code 由邮箱认证重定向
   */
  @Post('/codeLogin')
  async codeLogin(@Body() codeLoginDto: CodeLoginDto) {
    console.log('codeLoginDto', codeLoginDto);
    const res = await this.authService.codeLogin(codeLoginDto.code);

    return this.res.success(res);
  }

  /**
   * 修改密码(输入旧密码)
   */
  @UseGuards(JwtAuthGuard)
  @Post('/changePassword')
  async changePassword(
    @CurrentUser() user: UserDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // 验证用户旧密码
    await this.userService.validateUser(
      user.username,
      changePasswordDto.oldPassword,
    );

    // 修改成新密码
    await this.userService.savePassword(user.id, changePasswordDto.newPassword);

    return this.res.success(null, '修改成功');
  }

  @Post('/forgotChangePassword')
  async forgotChangePassword(
    @Body() forgotChangePasswordDto: ForgotChangePasswordDto,
  ) {
    const { email, code, password } = forgotChangePasswordDto;

    // 先检查email code 是否有效
    const res = await this.emailService.verify(email, code);

    if (!res) {
      throw new BusinessException('code过期', ResService.CODES.BadRequest);
    }

    // 获取用户
    const user = await this.userService.findByEmail(email);
    // 修改密码
    await this.userService.savePassword(user.id, password);

    return this.res.success(null, '修改成功');
  }
}
