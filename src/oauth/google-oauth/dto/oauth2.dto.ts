import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleFastSignInDto {
  @IsString({ message: 'Code类型是字符串' })
  @IsNotEmpty({ message: 'Code不能为空' })
  code: string;
}

export class GoogleFastSignUnDto {
  @IsString({ message: 'Code类型是字符串' })
  @IsNotEmpty({ message: 'Code不能为空' })
  code: string;
}
