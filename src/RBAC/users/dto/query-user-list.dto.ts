import { IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUserListDto {
  @Type(() => Number) // 确保 Query 参数转换为 Number
  @IsNumber()
  @Min(1)
  @IsOptional()
  current?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageSize?: number = 20;

  /**
   * Search term for username, email, firstName, or lastName
   */
  search?: string;

  @IsOptional()
  sortBy?: string = 'createdAt'; // 默认排序字段

  @IsOptional()
  @IsIn(['ASC', 'DESC']) // 限制排序方向
  sortOrder?: 'ASC' | 'DESC' = 'DESC'; // 默认降序
  /**
   * 状态
   */
  status?: Status;
}

/**
 * 状态
 */
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Locked = 'locked',
}
