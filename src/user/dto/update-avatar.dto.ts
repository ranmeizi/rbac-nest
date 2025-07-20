import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateAvatarDto {
  /**
   * 用户头像URL
   */
  @IsNotEmpty({ message: '头像URL不能为空' })
  @IsString({ message: '头像URL必须是字符串' })
  @IsUrl({}, { message: '头像URL格式不正确' })
  avatar: string;
} 