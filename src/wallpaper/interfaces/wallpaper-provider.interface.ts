// 壁纸信息接口
export interface WallpaperInfo {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbUrl?: string;
  downloadUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  provider: string;
}

// 壁纸类别接口
export interface WallpaperCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
  thumbUrl?: string;
  provider: string;
}

// 热门搜索接口
export interface HotSearchItem {
  keyword: string;
  rank: number;
  count?: number;
  provider: string;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 壁纸提供者抽象接口
export interface IWallpaperProvider {
  /**
   * 获取提供者名称
   */
  getProviderName(): string;

  /**
   * 获取所有壁纸类别
   */
  getAllCategories(): Promise<WallpaperCategory[]>;

  /**
   * 根据类别获取壁纸列表
   * @param cid 类别ID
   * @param start 开始位置
   * @param count 数量
   */
  getWallpapersByCategory(
    cid: string | number,
    start?: number,
    count?: number,
  ): Promise<PaginatedResponse<WallpaperInfo>>;

  /**
   * 搜索壁纸
   * @param keyword 关键词
   * @param start 开始位置
   * @param count 数量
   */
  searchWallpapers(
    keyword: string,
    start?: number,
    count?: number,
  ): Promise<PaginatedResponse<WallpaperInfo>>;

  /**
   * 获取热门搜索关键词
   */
  getHotSearchKeywords(): Promise<HotSearchItem[]>;
}
