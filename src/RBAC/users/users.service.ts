import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumUserStatus, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CrudService } from 'src/utils/crud/crud.service';
import { QueryUserListDto } from './dto/query-user-list.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly crud: CrudService,
  ) {}

  // 创建 password 返回加密后的 password 和 盐
  genStorePassword(password: string): [string, string] {
    // 生成随机盐
    const salt = crypto.randomBytes(4).toString('hex');
    // 使用盐对密码进行加密
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'sha512') // 使用 PBKDF2 算法
      .toString('hex');

    return [hash, salt];
  }

  /**
   * 验证密码是否匹配
   * @param plainPassword 明文密码
   * @param hashedPassword 数据库中存储的加密密码
   * @param salt 数据库中存储的盐
   * @returns 是否匹配
   */
  validatePassword(
    plainPassword: string,
    hashedPassword: string,
    salt: string,
  ): boolean {
    // 使用相同的盐和算法生成哈希值
    const hash = crypto
      .pbkdf2Sync(plainPassword, salt, 1000, 32, 'sha512') // 32 字节的哈希值
      .toString('hex');

    // 比较生成的哈希值和存储的哈希值
    return hash === hashedPassword;
  }

  /** 创建用户 */
  async create(createUserDto: CreateUserDto) {
    // TODO 生成 psw 和 salt
    const [password, salt] = this.genStorePassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password,
      salt,
      status: EnumUserStatus.ACTIVE,
    });

    return await this.userRepository.save(user);
  }

  async findAll({ search, status, ...pagination }: QueryUserListDto) {
    const list = await this.crud.paginate({
      repository: this.userRepository,
      pagination,
      alias: 'user',
      filter(qb) {
        if (!!status) {
          qb = qb.where('user.status = :status', { status });
        }

        if (!!search) {
          qb = qb.where('user.username LIKE :search', {
            search: `%${search}%`,
          });
        }

        return qb;
      },
    });

    console.log('list', list);
    return list;
  }

  async findOne(id: string) {
    const res = await this.userRepository.findOneBy({ id });
    return res;
  }

  update(updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto.id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
