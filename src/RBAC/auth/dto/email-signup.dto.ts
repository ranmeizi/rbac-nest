import { IsString, IsNotEmpty } from 'class-validator';

export class EmailSignupDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  verifyCode: string;
}

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
