import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class CrudService {
  paginate<Entity>(options: {
    repository: Repository<Entity>;
    pagination: PaginationDto;
    alias?: string;
    filter?: (qb: SelectQueryBuilder<Entity>) => void;
    relations?: string[];
  }): Promise<PaginatedResult<Entity>> {
    const {
      repository,
      pagination,
      alias = 'entity',
      filter,
      relations,
    } = options;

    const qb = repository.createQueryBuilder(alias);

    // 关联查询
    relations?.forEach((rel) => qb.leftJoinAndSelect(`${alias}.${rel}`, rel));

    // 筛选
    filter?.(qb);

    const {
      current = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = pagination;

    // 分页
    return qb
      .orderBy(`${alias}.${sortBy}`, sortOrder)
      .skip((current - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()
      .then(([items, total]) => ({
        list: items,
        total,
        current: Number(current),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize),
      }));
  }
}
