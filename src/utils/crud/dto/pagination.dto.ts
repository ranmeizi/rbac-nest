import { IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number) // 确保 Query 参数转换为 Number
  @IsNumber()
  @Min(1)
  @IsOptional()
  current?: number = 1; // 默认第一页

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageSize?: number = 20; // 默认每页10条

  @IsOptional()
  @IsIn(['ASC', 'DESC']) // 限制排序方向
  sortOrder?: 'ASC' | 'DESC' = 'DESC'; // 默认降序

  @IsOptional()
  sortBy?: string = 'createdAt'; // 默认排序字段
}
