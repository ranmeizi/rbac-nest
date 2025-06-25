import { IsString, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verifyCode: string;

  firstName?: string;
  lastName?: string;
}

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
