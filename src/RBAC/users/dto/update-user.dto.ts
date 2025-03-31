export class UpdateUserDto {
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 姓氏
   */
  firstName?: string;
  /**
   * ID 编号
   */
  id: string;
  /**
   * 名字
   */
  lastName?: string;
  /**
   * 状态 active-正常 inactive-失效 locked-锁定
   */
  status?: string;
}
