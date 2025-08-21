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
  FORGOT_PASSWORD = 3, // 忘记密码 验证一下邮箱重置
}

abstract class AbstractCallback {
  type: EnumEVCType;
}
/**
 * 用于email 验证的context
 */
export type EmailCallbackContext =
  | GoogleOAuth2VerifyCallbackContext
  | ForgotPasswordCallbackContext;

/**
 * 谷歌oauth2触发的邮箱认证context
 *
 * profile 缓存用于注册的用户信息
 * ua 用于验证同一设备的ua
 */
export class GoogleOAuth2VerifyCallbackContext extends AbstractCallback {
  type: EnumEVCType;
  profile: IDTokenDto;
  ua?: string; // 设备ua
}

/**
 * 忘记密码的邮箱认证 context
 */
export class ForgotPasswordCallbackContext extends AbstractCallback {
  type: EnumEVCType;
  username: string; // 用户名
}
