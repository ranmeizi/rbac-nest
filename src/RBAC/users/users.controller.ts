import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResService } from 'src/res/res.service';
import { QueryUserListDto } from './dto/query-user-list.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly res: ResService,
  ) {}

  /** 创建用户 */
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.usersService.create(createUserDto);
    return this.res.success(res);
  }

  /** 查询用户列表 */
  @Get('/list')
  async findAll(@Query() queryUserListDto: QueryUserListDto) {
    const res = await this.usersService.findAll(queryUserListDto);
    return this.res.success(res);
  }

  /** 查询单个用户 */
  @Get('/getUserById')
  async findOne(@Query('id') id: string) {
    const res = await this.usersService.findOne(id);
    return this.res.success(res);
  }

  /** 修改用户 */
  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  /** 删除用户 */
  @Post('/delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
