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

enum EnumSendError {
  正常,
  发送太快,
  超出最大次数,
}

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(VerifyCode)
    private readonly codeRepository: Repository<VerifyCode>,
    @InjectRepository(VerifyCodeLog)
    private readonly codeLogRepository: Repository<VerifyCodeLog>,
  ) {}

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

  async verify(target, code: string) {
    // 查询该邮箱的最新验证码
    const activeCode = await this.codeRepository.find({
      where: { target },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (activeCode.length > 0) {
      const latestCode = activeCode[0];

      if (latestCode.verifyCode === code) {
        // 验证成功，删除记录
        await this.codeRepository.delete({ target });
        return true;
      }
    }

    // 验证失败，删除记录
    await this.codeRepository.delete({ target });
    return false;
  }

  async sendEmailCode(email: string, code: string) {
    const params: any = {
      AccountName: 'quantum@quantumdash.link',
      AddressType: 1,
      ReplyToAddress: false,
      ToAddress: email,
      Subject: 'Code',
      HtmlBody: `<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <title>Quantum - 邮箱验证</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f8f9fa;
      min-height: 100vh;
      color: #1d1d1f;
      line-height: 1.47;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .email-container {
      max-width: 400px;
      margin: 80px auto;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
    
    .content {
      padding: 48px 40px;
      text-align: center;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: #1d1d1f;
      border-radius: 14px;
      margin-bottom: 32px;
    }
    
    .logo-icon::before {
      content: 'Q';
      font-weight: 700;
      font-size: 24px;
      color: white;
    }
    
    .brand-name {
      font-size: 32px;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 8px;
      letter-spacing: -0.5px;
    }
    
    .brand-subtitle {
      font-size: 15px;
      color: #86868b;
      margin: 0 0 40px;
      font-weight: 400;
    }
    
    .welcome-title {
      font-size: 20px;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 12px;
      letter-spacing: -0.2px;
    }
    
    .welcome-text {
      font-size: 15px;
      color: #6e6e73;
      margin: 0 0 40px;
      line-height: 1.5;
    }
    
    .verification-section {
      background: #f6f6f6;
      border-radius: 12px;
      padding: 24px;
      margin: 0 0 32px;
    }
    
    .verification-label {
      font-size: 13px;
      color: #86868b;
      margin: 0 0 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .verification-code {
      font-size: 32px;
      font-weight: 700;
      color: #1d1d1f;
      margin: 0 0 8px;
      letter-spacing: 6px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      user-select: all;
      -webkit-user-select: all;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }
    
    .verification-code:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .expiry-notice {
      font-size: 13px;
      color: #86868b;
      margin: 0;
      font-weight: 400;
    }
    
    .security-notice {
      font-size: 14px;
      color: #86868b;
      margin: 0;
      line-height: 1.5;
    }
    
    @media (max-width: 480px) {
      .email-container {
        margin: 40px 20px;
        border-radius: 16px;
      }
      
      .content {
        padding: 40px 32px;
      }
      
      .brand-name {
        font-size: 28px;
      }
      
      .verification-code {
        font-size: 28px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <div class="logo">
        <div class="logo-icon"></div>
      </div>
      
      <h1 class="brand-name">Quantum</h1>
      <p class="brand-subtitle">新标签页浏览体验</p>
      
      <h2 class="welcome-title">验证您的邮箱</h2>
      <p class="welcome-text">
        请使用下方验证码完成注册
      </p>
      
      <div class="verification-section">
        <p class="verification-label">验证码</p>
        <p class="verification-code">${code}</p>
        <p class="expiry-notice">10 分钟内有效</p>
      </div>
      
      <p class="security-notice">
        如果这不是您的操作，请忽略此邮件。
      </p>
    </div>
  </div>
</body>
</html>`
        .replaceAll(/\r\n/g, '')
        .replaceAll(/\n/g, ''),
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

  async getRandomString() {
    return randomString(32);
  }
  async getHash() {
    return crypto.createHash('sha256').update('').digest('hex');
  }
}
