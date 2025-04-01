import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumUserStatus, User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CrudService } from 'src/utils/crud/crud.service';
import { QueryUserListDto } from './dto/query-user-list.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly crud: CrudService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      salt: 'salt1234',
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto.id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
