export class CreateUserDto {
  /**
   * 邮箱
   */
  email: string;
  /**
   * 姓氏
   */
  firstName?: string;
  /**
   * 名字
   */
  lastName?: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 用户名
   */
  username: string;
}
