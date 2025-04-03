import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryUserListDto } from '../users/dto/query-user-list.dto';
import { CrudService } from 'src/utils/crud/crud.service';
import { Role } from 'src/entities/role.entity';
import { BindPermissionDto } from './dto/bind-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // 使用 Role 实体
    private readonly permissionsService: PermissionsService, // 注入 PermissionsService
    private readonly crud: CrudService,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create({
      ...createRoleDto,
      isSystem: false,
    });
    return await this.roleRepository.save(role);
  }

  /**
   * 分页查询角色
   */
  async findAll({ search, ...pagination }: QueryUserListDto) {
    const list = await this.crud.paginate({
      repository: this.roleRepository,
      pagination,
      alias: 'role',
      filter(qb) {
        if (search) {
          qb = qb.where('role.name LIKE :search', { search: `%${search}%` });
        }
        return qb;
      },
    });

    return list;
  }

  /**
   * 查询单个角色
   */
  async findOne(id: string) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error(`角色 ID ${id} 不存在`);
    }
    return role;
  }

  /**
   * 修改角色
   */
  async update(updateRoleDto: UpdateRoleDto) {
    const { id, ...updateData } = updateRoleDto;

    // 查找角色是否存在
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error(`角色 ID ${id} 不存在`);
    }

    // 更新角色信息
    Object.assign(role, updateData);
    return await this.roleRepository.save(role);
  }

  /**
   * 删除角色
   */
  async remove(id: string) {
    // 查找角色是否存在
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error(`角色 ID ${id} 不存在`);
    }

    // 删除角色
    await this.roleRepository.remove(role);
    return { message: `角色 ID ${id} 已删除` };
  }

  /**
   * 查询角色的权限列表
   */
  async findAllPermissions(roleId: string) {
    console.log('findAllPermissions', roleId);
    // 查找角色是否存在
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'], // 加载关联的权限
    });

    if (!role) {
      throw new Error(`角色 ID ${roleId} 不存在`);
    }

    const rolePermissions = await role.permissions;
    console.log('Role:', role);
    console.log('Permissions:', role?.permissions, rolePermissions);
    return rolePermissions;
  }

  /**
   * 为角色绑定权限
   */
  async bindPermission(bindPermissionDto: BindPermissionDto) {
    const { roleId, permissionId } = bindPermissionDto;

    // 查找角色是否存在
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`角色 ID ${roleId} 不存在`);
    }

    // 调用 PermissionsService 检查权限是否存在
    const permission = await this.permissionsService.findOne(permissionId);

    if (!permission) {
      throw new Error(`权限 ID ${permissionId} 不存在`);
    }

    const rolePermissions = await role.permissions;

    // 检查权限是否已绑定
    if (rolePermissions.some((p) => p.id === permissionId)) {
      throw new Error(`权限 ID ${permissionId} 已绑定到角色 ID ${roleId}`);
    }

    // 绑定权限
    rolePermissions.push(permission);
    await this.roleRepository.save(role);

    return null;
  }

  /**
   * 为角色移除权限
   */
  async removePermission(removePermissionDto: RemovePermissionDto) {
    const { roleId, permissionId } = removePermissionDto;

    // 查找角色是否存在
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`角色 ID ${roleId} 不存在`);
    }

    // 确保 permissions 已加载
    const rolePermissions = await role.permissions;

    // 查找权限是否存在于角色中
    const permissionIndex = rolePermissions.findIndex(
      (p) => p.id === permissionId,
    );
    if (permissionIndex === -1) {
      throw new Error(`权限 ID ${permissionId} 未绑定到角色 ID ${roleId}`);
    }

    // 移除权限
    rolePermissions.splice(permissionIndex, 1);
    await this.roleRepository.save(role);

    return null;
  }
}
