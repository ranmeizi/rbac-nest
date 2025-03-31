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

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.usersService.create(createUserDto);
    return this.res.success(res);
  }

  @Get('/list')
  findAll(@Query() queryUserListDto: QueryUserListDto) {
    // const res = this.usersService.findAll(queryUserListDto);
    return this.res.success(res);
  }

  @Get('/getUserById')
  findOne(@Param('id') id: string) {
    throw new Error('这里有问题');
    return this.usersService.findOne(+id);
  }

  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Post('/delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
