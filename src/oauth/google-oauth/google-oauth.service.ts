import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  GoogleAccessTokenResDto,
  GoogleGetTokenParamDto,
  IDTokenDto,
} from './dto/google.dto';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { OAuth2GoogleEntity } from 'src/entities/oa_google.entity';
import { UserDto } from 'src/rbac/users/dto/expose-user.dto';

@Injectable()
export class GoogleOauthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly oaGoogleAccountRepository: Repository<OAuth2GoogleEntity>,
  ) {}

  /** 校验 google token 签名 */
  private async _verifyGoogleIdToken(idToken: string): Promise<IDTokenDto> {
    // 1. 获取 Google 的公钥
    const client = new JwksClient({
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    });

    // 2. 解码 JWT 头部获取 kid (Key ID)
    const decoded = jwt.decode(idToken, { complete: true });
    const kid = decoded?.header.kid;

    // 3. 根据 kid 获取对应的公钥
    const key = await client.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    // 4. 验证 JWT（使用 @nestjs/jwt）
    return this.jwtService.verify(idToken, {
      publicKey,
      algorithms: ['RS256'],
      issuer: 'https://accounts.google.com',
      audience: process.env.GOOGLE_OAUTH2_CLIENT_ID, // 替换为你的客户端ID
    });
  }

  /**
   * 查询用户绑定的google 账号
   */
  async findGoogleAccountByUserId(id: string) {
    const googleAccount = await this.oaGoogleAccountRepository.findOneBy({
      userId: id,
    });

    return googleAccount;
  }

  /**
   * 用授权 sub 查询google账号绑定的 userId
   */
  async findGoogleAccountByGoogleSub(sub: string) {
    const googleAccount = await this.oaGoogleAccountRepository.findOneBy({
      sub,
    });

    return googleAccount;
  }

  /** 用 profile 创建绑定 */
  async bindUserGoogleAccountByProfile(user: UserDto, profile: IDTokenDto) {
    const entity = this.oaGoogleAccountRepository.create({
      userId: user.id,
      sub: profile.sub,
      email: profile.email,
      emailVerified: profile.email_verified,
      name: profile.name,
      givenName: profile.given_name,
      familyName: profile.family_name,
      // 可根据你的实体结构补充字段
    });
    await this.oaGoogleAccountRepository.save(entity);
    return entity;
  }

  /**
   * 绑定 google 账号
   */
  async bindUserGoogleAccount(user: UserDto, code: string) {
    // 1. 用 code 换取 access_token 和 id_token
    const tokenRes = await this.getAccessToken(code);

    // 2. 校验 id_token 并获取 Google profile
    const profile = await this._verifyGoogleIdToken(tokenRes.id_token);

    // 3. 保存 Google 账号信息到 OAuth2GoogleEntity 表
    const entity = this.bindUserGoogleAccountByProfile(user, profile);

    return entity;
  }

  /**
   * 解绑 google 账号
   */
  async unbindUserGoogleAccount(user: UserDto, sub: string) {
    await this.oaGoogleAccountRepository.delete({ userId: user.id, sub: sub });
    return;
  }

  /**
   * 可能是账号注销了
   * 清除所有用户绑定
   */
  async clearGoogleAccount(user: User) {
    await this.oaGoogleAccountRepository.delete({ userId: user.id });
    return;
  }

  /** 获取 AccessTokenRes */
  async getAccessToken(code: string): Promise<GoogleAccessTokenResDto> {
    const params: GoogleGetTokenParamDto = {
      code,
      client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_OAUTH2_REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    const res = await axios<GoogleAccessTokenResDto>(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        data: params,
      },
    );
    return res.data;
  }

  /** 验签 */
  async getProfileByIdToken(idToken: string) {
    const profile = await this._verifyGoogleIdToken(idToken);
    return profile;
  }

  /** 获取 google profile */
  async getProfile(code: string) {
    const { id_token } = await this.getAccessToken(code);
    const profile = await this.getProfileByIdToken(id_token);

    return profile;
  }
}
