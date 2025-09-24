import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { ResService } from 'src/res/res.service';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { UserDto } from 'src/RBAC/users/dto/expose-user.dto';
import { UsersService } from 'src/RBAC/users/users.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly res: ResService,
    private readonly usersService: UsersService,
  ) {}

  /** 验证token有效性 */
  @Get('/verify')
  async verifyToken(@CurrentUser() user: UserDto) {
    // 如果能到达这里，说明token是有效的
    return this.res.success({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  }

  /** 获取当前用户信息 */
  @Get('/profile')
  async getProfile(@CurrentUser() user: UserDto) {
    return this.res.success({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  }

  /** 更新当前用户头像 */
  @Post('/avatar')
  async updateAvatar(
    @CurrentUser() user: UserDto,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ) {
    await this.usersService.update({
      id: user.id,
      avatar: updateAvatarDto.avatar,
    });
    return this.res.successMessage('头像更新成功');
  }
}
