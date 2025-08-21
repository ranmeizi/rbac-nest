import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// Code 登陆参数
export class CodeLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

// Code 登陆上下文
export class CodeLoginContext {
  userId: string;
}
