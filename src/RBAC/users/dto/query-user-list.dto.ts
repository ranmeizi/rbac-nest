export class QueryUserListDto {
  current?: number;
  pageSize?: number;
  /**
   * Search term for username, email, firstName, or lastName
   */
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  /**
   * 状态
   */
  status?: Status;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * 状态
 */
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Locked = 'locked',
}
