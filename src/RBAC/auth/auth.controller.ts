import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResService } from 'src/res/res.service';
import { LoginDto } from './dto/login.dto';
import { EmailService } from 'src/utils/email/email.service';
import { SignupDto } from './dto/signup.dto';
import { BusinessException } from 'src/error-handler/BusinessException';
import { UsersService } from '../users/users.service';
import {
  EnumVerifyCodeOperate,
  EnumVerifyCodeType,
} from 'src/entities/verify_code.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly res: ResService,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
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
  async sendEmail(@Body() { email }: { email: string }, @Req() req: any) {
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

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    // 校验code
    if (
      !(await this.emailService.verify(signupDto.email, signupDto.verifyCode))
    ) {
      throw new BusinessException(`验证码错误`, ResService.CODES.BadRequest);
    }

    // 创建用户
    await this.userService.create(signupDto);

    return this.res.success('');
  }
}
