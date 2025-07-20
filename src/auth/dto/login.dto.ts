import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '请输入正确的邮箱格式' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
} 