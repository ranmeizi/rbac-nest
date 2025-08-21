import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 修改密码
 */
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
