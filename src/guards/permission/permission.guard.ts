import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true; // 如果没有设置权限要求，则允许访问
    }

    const request = context.switchToHttp().getRequest();
    const permissions = request.user.permissions; // 假设用户信息已通过认证中间件附加到请求上

    console.log('permis', permissions);
    if (!permissions) {
      return false;
    }

    // 检查用户是否拥有所有需要的权限
    return requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );
  }
}
