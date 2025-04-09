import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization 头中提取 JWT
      ignoreExpiration: false, // 如果令牌过期，则拒绝请求
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // payload 是解码后的 JWT 数据
    console.log('JWT payload:', payload);
    return { userId: payload.userId, username: payload.username };
  }
}
