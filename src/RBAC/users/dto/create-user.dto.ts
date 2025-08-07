import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * 邮箱
   */
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  /**
   * 密码
   */
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  @MaxLength(20, { message: '密码长度不能超过20个字符' })
  password: string;
}
