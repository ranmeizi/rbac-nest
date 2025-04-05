import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResService } from 'src/res/res.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly res: ResService,
  ) {}

  /** 用户登录 */
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return this.res.success(result);
  }
}
