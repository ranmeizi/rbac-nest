import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  /**
   * 密码
   */
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度6~20个字符' })
  @MaxLength(20, { message: '密码长度6~20个字符' })
  password: string;

  /**
   * 邮箱
   */
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  /**
   * 昵称
   */
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  nickname?: string;

  /**
   * 头像
   */
  @IsOptional()
  @IsString({ message: '请输入正确的头像url' })
  @MaxLength(1000, { message: '头像url超出最大长度' })
  picture?: string;
}
