import { Injectable } from '@nestjs/common';
import { randomString } from '../index';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import axios from 'axios';
import { BusinessException } from 'src/error-handler/BusinessException';
import { ResService } from 'src/res/res.service';
import { MoreThan, Repository } from 'typeorm';
import {
  EnumVerifyCodeOperate,
  EnumVerifyCodeType,
  VerifyCode,
} from 'src/entities/verify_code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyCodeLog } from 'src/entities/verify_code_log.entity';
import { EmailVerifyContext, EnumEVCType } from './dto/email.dto';
import { AuthService } from 'src/rbac/auth/auth.service';
import { UsersService } from 'src/rbac/users/users.service';
import { GoogleOauthService } from 'src/oauth/google-oauth/google-oauth.service';
import { URLSearchParams } from 'url';

enum EnumSendError {
  正常,
  发送太快,
  超出最大次数,
}

@Injectable()
export class EmailService {
  static EMAIL_QUERY_AES = {
    key: '4db2ca928ae39a05',
    iv: '891bf307f17fe230',
  };

  constructor(
    @InjectRepository(VerifyCode)
    private readonly codeRepository: Repository<VerifyCode>,
    @InjectRepository(VerifyCodeLog)
    private readonly codeLogRepository: Repository<VerifyCodeLog>,
    private readonly authServices: AuthService,
    private readonly userServices: UsersService,
    private readonly googleOauthServices: GoogleOauthService,
  ) {}

  // 参数加密
  _encryptSearch(params: Record<string, any>) {
    const plainText = JSON.stringify(params);
    // 密钥和 IV 必须是 8 字节
    const cipher = crypto.createCipheriv(
      'aes-128-cbc',
      Buffer.from(EmailService.EMAIL_QUERY_AES.key),
      Buffer.from(EmailService.EMAIL_QUERY_AES.iv),
    );
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  _decryptSearch(encryptedText: string): Record<string, any> {
    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      Buffer.from(EmailService.EMAIL_QUERY_AES.key),
      Buffer.from(EmailService.EMAIL_QUERY_AES.iv),
    );
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  // 校验 IP
  async checkIp(ip: string): Promise<EnumSendError> {
    // 判断 log 表中 1天内这个 IP 发送的次数
    const count = await this.codeLogRepository.count({
      where: {
        ip,
        createdAt: MoreThan(
          dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).toDate(),
        ),
      },
    });

    if (count > 10) {
      return EnumSendError.超出最大次数;
    }

    return EnumSendError.正常;
  }

  // 生成验证码
  async genCode(ip: string) {
    const res = await this.checkIp(ip);
    if (res === EnumSendError.超出最大次数) {
      throw new BusinessException(`超出最大次数`, ResService.CODES.BadRequest);
    }

    // 生成随机验证码
    const chars = '1234567890'; // 去除易混淆字符
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 返回 code
    return code;
  }

  // 写入
  async insertCode({
    code,
    type,
    operate,
    target,
    ip,
  }: {
    code: string;
    type: EnumVerifyCodeType;
    operate: EnumVerifyCodeOperate;
    target: string;
    ip: string;
  }) {
    // 放入 code 表
    const verifyCode = await this.codeRepository.create({
      verifyCode: code,
      type,
      operate,
      target,
    });
    // 放入 code log 表
    const verifyCodeLog = await this.codeLogRepository.create({
      verifyCode: code,
      type,
      operate,
      target,
      ip,
    });

    await this.codeRepository.save(verifyCode);
    await this.codeLogRepository.save(verifyCodeLog);
  }

  // 验证
  async verify(target, code: string) {
    const activeCode = await this.codeRepository.find({
      where: {
        target,
        createdAt: MoreThan(dayjs().subtract(10, 'm').toDate()),
      },
    });

    const remove = async () => {
      await this.codeRepository.delete({
        target,
      });
    };

    if (activeCode.length > 0) {
      // 检查是不是有效
      if (activeCode.find((row) => row.verifyCode === code)) {
        // 验证成功
        remove();
        return true;
      } else {
        // 验证失败
        return false;
      }
    } else {
      // 失效了 删除记录
      await remove();
      return false;
    }
  }

  /** 调用阿里发送邮件 */
  private async _sendEmail(email: string, HtmlBody: string) {
    const params: any = {
      AccountName: 'bozi@mail.boboan.net',
      AddressType: 1,
      ReplyToAddress: false,
      ToAddress: email,
      Subject: 'Code',
      HtmlBody,
    };

    function percentCode(str) {
      return encodeURIComponent(str)
        .replace(/\+/g, '%20')
        .replace(/\*/g, '%2A')
        .replace(/~/g, '%7E')
        .replace(/\!/g, '%21')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/'/g, '%27');
    }

    const CanonicalQueryString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${percentCode(key)}=${percentCode(value)}`)
      .join('&');

    const HashedRequestPayload = crypto
      .createHash('sha256')
      .update('')
      .digest('hex');

    // 请求头值
    const headers = {
      host: 'dm.aliyuncs.com',
      'x-acs-action': 'SingleSendMail',
      'x-acs-content-sha256': HashedRequestPayload,
      'x-acs-date': new Date().toISOString().replace(/\..+/, 'Z'),
      'x-acs-signature-nonce': randomString(32),
      'x-acs-version': '2015-11-23',
    };

    // 签名
    const HTTPRequestMethod = 'GET';
    const CanonicalURI = '/';
    const SignatureAlgorithm = 'ACS3-HMAC-SHA256';

    let CanonicalHeaders = '';
    let SignedHeaders = '';

    for (const [HeaderName, HeaderValue] of Object.entries(headers)) {
      CanonicalHeaders +=
        `${HeaderName.toLocaleLowerCase()}:${HeaderValue.trim()}` + '\n';
      SignedHeaders += `${HeaderName.toLocaleLowerCase()};`;
    }

    // 规范化请求
    const CanonicalRequest =
      HTTPRequestMethod +
      '\n' +
      CanonicalURI +
      '\n' +
      CanonicalQueryString +
      '\n' +
      CanonicalHeaders +
      '\n' +
      SignedHeaders +
      '\n' +
      HashedRequestPayload;

    const HashedCanonicalRequest = crypto
      .createHash('sha256')
      .update(CanonicalRequest)
      .digest('hex');

    const StringToSign = SignatureAlgorithm + '\n' + HashedCanonicalRequest;

    const Signature = crypto
      .createHmac('sha256', process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET)
      .update(StringToSign)
      .digest('hex');

    const Authorization = `${SignatureAlgorithm} Credential=${process.env.ALIBABA_CLOUD_ACCESS_KEY_ID},SignedHeaders=${SignedHeaders},Signature=${Signature}`;

    // 发送请求
    await axios('https://dm.aliyuncs.com/', {
      method: 'GET',
      headers: {
        Authorization: Authorization,
        ...headers,
      },
      params,
    });
    // .then((res) => {
    //   console.log('wwwji', res);
    // })
    // .catch((e) => {
    //   console.warn('err', e);
    // });
  }

  /** 发送邮箱验证码邮件 */
  async sendEmailCode(email: string, code: string) {
    const body = `<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <title>Boboan.net - 邮箱验证码</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: linear-gradient(135deg, #0f2027, #2c5364, #1c92d2);
      font-family: 'Segoe UI', 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      color: #fff;
    }
    .container {
      max-width: 420px;
      margin: 48px auto;
      background: rgba(30, 40, 60, 0.95);
      border-radius: 18px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      padding: 36px 32px 28px 32px;
      text-align: center;
      border: 1.5px solid rgba(255,255,255,0.08);
    }
    .logo {
      font-size: 2.2em;
      font-weight: bold;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #00c6ff, #0072ff, #f7971e, #ffd200);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 18px;
      animation: shine 2s infinite linear alternate;
    }
    @keyframes shine {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.3); }
    }
    .title {
      font-size: 1.3em;
      margin-bottom: 18px;
      letter-spacing: 1px;
      color: #ffd200;
      font-weight: 500;
    }
    .content {
      font-size: 1.1em;
      margin-bottom: 32px;
      color: #e0e0e0;
      letter-spacing: 0.5px;
    }
    .code-box {
      display: inline-block;
      background: linear-gradient(90deg, #00c6ff, #0072ff);
      color: #fff;
      font-size: 2.1em;
      letter-spacing: 8px;
      font-weight: bold;
      padding: 16px 32px;
      border-radius: 12px;
      box-shadow: 0 2px 12px 0 rgba(0, 198, 255, 0.18);
      margin-bottom: 24px;
      user-select: all;
      font-family: 'Consolas', 'Menlo', monospace;
    }
    .footer {
      margin-top: 32px;
      font-size: 0.95em;
      color: #b0b0b0;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Boboan.net</div>
    <div class="title">邮箱验证码</div>
    <div class="content">这是您的验证码</div>
    <div class="code-box">${code}</div>
    <div class="footer">如果不是您本人操作，请忽略此邮件。</div>
  </div>
</body>
</html>`
      .replaceAll(/\r\n/g, '')
      .replaceAll(/\n/g, '');

    return this._sendEmail(email, body);
  }

  /** 发送邮箱认证邮件 */
  async sendEmailVerify(email: string, callbackUrl: string) {
    const body = `<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <title>Boboan.net - 邮箱认证</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: linear-gradient(135deg, #232526, #414345, #1c92d2);
      font-family: 'Segoe UI', 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      color: #fff;
    }
    .container {
      max-width: 420px;
      margin: 48px auto;
      background: rgba(30, 40, 60, 0.97);
      border-radius: 18px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      padding: 36px 32px 28px 32px;
      text-align: center;
      border: 1.5px solid rgba(255,255,255,0.08);
    }
    .logo {
      font-size: 2.2em;
      font-weight: bold;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #00c6ff, #0072ff, #f7971e, #ffd200);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 18px;
      animation: shine 2s infinite linear alternate;
    }
    @keyframes shine {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.3); }
    }
    .title {
      font-size: 1.3em;
      margin-bottom: 18px;
      letter-spacing: 1px;
      color: #ffd200;
      font-weight: 500;
    }
    .content {
      font-size: 1.1em;
      margin-bottom: 32px;
      color: #e0e0e0;
      letter-spacing: 0.5px;
    }
    .verify-link {
      font-size: 1.1em;
      color: #00c6ff;
      font-weight: bold;
      text-decoration: underline;
      word-break: break-all;
      margin-bottom: 24px;
      display: inline-block;
      transition: color 0.3s;
    }
    .verify-link:hover {
      color: #ffd200;
    }
    .footer {
      margin-top: 32px;
      font-size: 0.95em;
      color: #b0b0b0;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Boboan.net</div>
    <div class="title">邮箱认证</div>
    <div class="content">请点击下方链接完成您的邮箱认证：</div>
    <a class="verify-link" href="${callbackUrl}">${callbackUrl}</a>
    <div class="footer">如果不是您本人操作，请忽略此邮件。</div>
  </div>
</body>
</html>`
      .replaceAll(/\r\n/g, '')
      .replaceAll(/\n/g, '');

    return this._sendEmail(email, body);
  }

  async getRandomString() {
    return randomString(32);
  }
  async getHash() {
    return crypto.createHash('sha256').update('').digest('hex');
  }

  // 处理 邮箱认证的callback
  async handleEmailVerifyCallback(
    context: EmailVerifyContext,
    ua: string,
  ): Promise<{ params?: URLSearchParams }> {
    const params = new URLSearchParams();
    switch (context.type) {
      case EnumEVCType.BIND:
        // 调用绑定
        break;
      case EnumEVCType.FAST_LOGIN_SIGNUP:
        {
          // 创建用户
          const user = await this.userServices.fastSignUpByGoogleProfile(
            context.profile,
          );
          // 绑定账号
          await this.googleOauthServices.bindUserGoogleAccountByProfile(
            user,
            context.profile,
          );
          // 同一设备？生成登录 code
          if (context.ua === ua) {
            // 生成code
            const code = await this.authServices.getLoginCode(user.id, ua);

            params.append('code', code);
          }
        }
        break;

      case EnumEVCType.FAST_LOGIN_BIND:
        {
          // 用 email 查询用户
          const user = await this.userServices.findByEmail(
            context.profile.email,
          );
          // 绑定账号
          await this.googleOauthServices.bindUserGoogleAccountByProfile(
            user,
            context.profile,
          );
          // 同一设备？生成登录 code
          if (context.ua === ua) {
            // 生成code
            const code = await this.authServices.getLoginCode(user.id, ua);

            params.append('code', code);
          }
        }
        break;
      default:
        throw new BusinessException('参数错误', ResService.CODES.BadRequest);
    }

    return { params };
  }

  // 处理回调的重定向 从 hash 中传值
  async finishEmailVerifyRedirect(params: URLSearchParams) {
    const url = `${process.env.WEB_HOST}/o2/verify-res#${params.toString()}`;

    return url;
  }
}
