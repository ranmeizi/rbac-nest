import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResService } from 'src/res/res.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly res: ResService,
  ) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/list')
  findAll() {
    // return this.usersService.findAll();
    return this.res.success(this.usersService.findAll());
  }

  @Get('/getUserById')
  findOne(@Param('id') id: string) {
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
