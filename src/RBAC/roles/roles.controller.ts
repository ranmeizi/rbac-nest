import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryUserListDto } from '../users/dto/query-user-list.dto';
import { ResService } from 'src/res/res.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService, // 使用 RolesService 而非 UsersService
    private readonly res: ResService,
  ) {}

  /** 创建角色 */
  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.rolesService.create(createRoleDto);
    return this.res.success(result);
  }

  /** 查询角色列表 */
  @Get('/list')
  async findAll(@Query() queryUserListDto: QueryUserListDto) {
    const result = await this.rolesService.findAll(queryUserListDto);
    return this.res.success(result);
  }

  /** 查询单个角色 */
  @Get('/getRoleById')
  async findOne(@Query('id') id: string) {
    const result = await this.rolesService.findOne(id);
    return this.res.success(result);
  }

  /** 修改角色 */
  @Post('/update')
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    const result = await this.rolesService.update(updateRoleDto);
    return this.res.success(result);
  }

  /** 删除角色 */
  @Post('/delete')
  async remove(@Param('id') id: string) {
    const result = await this.rolesService.remove(id);
    return this.res.success(result);
  }
}
