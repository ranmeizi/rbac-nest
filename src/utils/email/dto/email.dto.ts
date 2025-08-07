import { IDTokenDto } from 'src/oauth/google-oauth/dto/google.dto';

export class DecodeVerifyParams {
  /**
   * 临时code 用于从临时表拿数据 其实是uuid
   */
  code: string;
}

export enum EnumEVCType {
  BIND = 0, // 绑定验证
  FAST_LOGIN_SIGNUP = 1, // 快捷登录->注册账号
  FAST_LOGIN_BIND = 2, // 快捷登录->绑定账号
}

/**
 * 用于email 验证的context
 */
export class EmailVerifyContext {
  type: EnumEVCType;
  profile: IDTokenDto;
  ua?: string; // 设备ua
}
