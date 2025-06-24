import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { randomString } from '../index';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import axios from 'axios';

const encoder = new TextEncoder();

@Injectable()
export class EmailService {
  constructor() {}

  async generateCode(){

  }

  async sendEmailCode(email: string, code: string) {
    const params: any = {
      AccountName: 'bozi@mail.boboan.net',
      AddressType: 1,
      ReplyToAddress: false,
      ToAddress: email,
      Subject: 'Code',
      HtmlBody: `<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8">
  <title>波波世界 - 邮箱验证码</title>
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
    <div class="logo">波波世界</div>
    <div class="title">邮箱验证码</div>
    <div class="content">这是您的验证码</div>
    <div class="code-box">${code}</div>
    <div class="footer">如果不是您本人操作，请忽略此邮件。</div>
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
