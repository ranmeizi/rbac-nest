import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

// 360壁纸类别枚举
export enum Wallpaper360Category {
  NEW = 'new',
  BEAUTY = 'beauty',
  SCENERY = 'scenery',
  CARTOON = 'cartoon',
  STAR = 'star',
  CAR = 'car',
  ANIMAL = 'animal',
  FLOWER = 'flower',
  GAME = 'game',
  OTHER = 'other',
}

// 壁纸提供者枚举
export enum WallpaperProvider {
  WALLPAPER_360 = '360',
}

// 分页查询基础DTO
export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  start?: string = '0';

  @IsOptional()
  @IsNumberString()
  count?: string = '10';
}

// 查询壁纸列表DTO
export class QueryWallpaperListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  cid?: string = '0';

  @IsOptional()
  @IsString()
  @IsEnum(WallpaperProvider)
  provider?: WallpaperProvider = WallpaperProvider.WALLPAPER_360;
}

// 搜索壁纸DTO
export class SearchWallpaperDto extends PaginationDto {
  @IsString()
  kw: string;

  @IsOptional()
  @IsString()
  @IsEnum(WallpaperProvider)
  provider?: WallpaperProvider = WallpaperProvider.WALLPAPER_360;
}

// 获取热门搜索DTO
export class GetHotSearchDto {
  @IsOptional()
  @IsString()
  @IsEnum(WallpaperProvider)
  provider?: WallpaperProvider = WallpaperProvider.WALLPAPER_360;
}
