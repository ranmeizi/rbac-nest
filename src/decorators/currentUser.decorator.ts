import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 获取当前用户信息
export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.user;
  },
);

// 获取当前用户的权限
export const CurrentUserPermission = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.permissions;
  },
);
