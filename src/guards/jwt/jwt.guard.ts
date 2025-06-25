import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/rbac/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization 头中提取 JWT
      ignoreExpiration: false, // 如果令牌过期，则拒绝请求
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // payload 是解码后的 JWT 数据
    const userId = payload.userId;
    // 查一下 User
    const user = await this.userService.findOne(userId);
    // 查一下 Permission
    const permissions = await this.userService.getUserPermissions(userId);

    return {
      user,
      permissions,
    };
  }
}
