import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryUserListDto } from '../users/dto/query-user-list.dto';
import { CrudService } from 'src/utils/crud/crud.service';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // 使用 Role 实体
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
}
