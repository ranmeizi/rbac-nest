import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { SendEmailDto } from 'src/RBAC/auth/dto/signup.dto';
import { EmailService } from 'src/utils/email/email.service';
import {
  EnumVerifyCodeOperate,
  EnumVerifyCodeType,
} from 'src/entities/verify_code.entity';
import { ResService } from 'src/res/res.service';
import { BusinessException } from 'src/error-handler/BusinessException';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly res: ResService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Get('preregister')
  @HttpCode(HttpStatus.OK)
  async preregister(@Query('email') email: string) {
    // 检查用户名是否已存在
    const existingEmail = await this.authService.preregister(email);

    return existingEmail;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // 校验code
    if (
      !(await this.emailService.verify(
        registerDto.email,
        registerDto.verifyCode,
      ))
    ) {
      throw new BusinessException(`验证码错误`, ResService.CODES.BadRequest);
    }
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
}
