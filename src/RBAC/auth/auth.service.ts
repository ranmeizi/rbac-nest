import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { UserDto } from '../users/dto/expose-user.dto';
import { GoogleOauthService } from 'src/oauth/google-oauth/google-oauth.service';
import { GoogleFastSignInDto } from 'src/oauth/google-oauth/dto/oauth2.dto';
import { EmailService } from 'src/utils/email/email.service';
import { IDTokenDto } from 'src/oauth/google-oauth/dto/google.dto';
import { EmailVerifyContext, EnumEVCType } from 'src/utils/email/dto/email.dto';
import { OnceContextService } from 'src/utils/once_context/once_context.service';
import { BusinessException } from 'src/error-handler/BusinessException';
import { ResService } from 'src/res/res.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly googleOauthService: GoogleOauthService,
    private readonly onceContextService: OnceContextService,
  ) {}

  private async _signToken(
    user: UserDto,
    needRefresh = false,
  ): Promise<TokenDto> {
    const expires_in = (Number(process.env.JWT_EXPIRES_IN) || 3600) * 1000;

    // 生成访问令牌 (accessToken)
    const payload = { username: user.email, sub: user.id, userId: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: expires_in,
      secret: process.env.JWT_SECRET, // 使用环境变量中的密钥
    });

    // 生成刷新令牌 (refreshToken)
    const refreshToken = needRefresh
      ? this.jwtService.sign(payload, {
          expiresIn: '1M', // 刷新令牌有效期为 1 个月
          secret: process.env.JWT_SECRET, // 使用环境变量中的密钥
        })
      : undefined;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expires_in,
      token_type: 'Bearer',
    };
  }

  /** 登录 */
  async login(loginDto: LoginDto) {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return this._signToken(user, true);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      return this._signToken(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  /**
   * [防滥用标识]
   * 确保用户授权code有效再调用
   * google 快捷注册 发送注册验证邮件
   */
  async __prevent_abuse__googleOAuthFastSignUpSendEmail({
    profile,
    ua,
  }: {
    profile: IDTokenDto;
    ua: string;
  }) {
    // 创建给callback的上下文
    const context: EmailVerifyContext = {
      type: EnumEVCType.SIGNUP_LOGIN,
      profile,
      ua,
    };

    // 存入临时表
    const temp_code = await this.onceContextService.set({ context });

    // 把 code 加入callback参数
    const z = this.emailService._encryptSearch({ code: temp_code });

    const callbackUrl = `${process.env.WEB_HOST}/email/verify?z=${z}`;

    // 发送邮件 等待回调
    await this.emailService.sendEmailVerify(profile.email, callbackUrl);
  }

  /**
   * [防滥用标识]
   * 确保用户授权code有效再调用
   * google 快捷注册 发送绑定验证邮件
   */
  async __prevent_abuse__googleOAuthBindAccountSendEmail({
    profile,
    ua,
  }: {
    profile: IDTokenDto;
    ua: string;
  }) {
    // 创建给callback的上下文
    const context: EmailVerifyContext = {
      type: EnumEVCType.BIND_LOGIN,
      profile,
      ua,
    };

    // 存入临时表
    const temp_code = await this.onceContextService.set({ context });

    // 把 code 加入callback参数
    const z = this.emailService._encryptSearch({ code: temp_code });

    const callbackUrl = `${process.env.WEB_HOST}/email/verify?z=${z}`;

    // 发送邮件 等待回调
    await this.emailService.sendEmailVerify(profile.email, callbackUrl);
  }

  /**
   * [防滥用标识]
   * 你要确保一定满足登录条件再调这个
   */
  async __prevent_abuse__OAuthSignToken(user: UserDto) {
    return this._signToken(user);
  }

  /**
   * code 登陆
   */
  async codeLogin(code: string) {
    const context = await this.onceContextService.get(code);

    if (!context) {
      throw new BusinessException('失败', ResService.CODES.BadRequest);
    }

    const user = await this.userService.findOne(context.userId);

    // token
    return this._signToken(user);
  }

  /**
   * 创建一个登陆凭证
   * ttl 30秒
   */
  async getLoginCode(userId: string, ua: string) {
    const uniqueId = `login_code,ua:${ua}`;

    // 先查一下有没有
    if (await this.onceContextService.checkHasUnique(uniqueId)) {
      throw new BusinessException(
        '超过可调用次数',
        ResService.CODES.BadRequest,
      );
    }

    const code = await this.onceContextService.set({
      context: { userId },
      ttl: 30,
      uniqueId,
    });

    return code;
  }
}
