import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  IWallpaperProvider,
  WallpaperInfo,
  WallpaperCategory,
  HotSearchItem,
  PaginatedResponse,
} from '../interfaces/wallpaper-provider.interface';

@Injectable()
export class Wallpaper360Provider implements IWallpaperProvider {
  private readonly logger = new Logger(Wallpaper360Provider.name);
  private readonly baseUrl = 'http://wallpaper.apc.360.cn/index.php';

  constructor(private readonly httpService: HttpService) {}

  getProviderName(): string {
    return '360';
  }

  async getAllCategories(): Promise<WallpaperCategory[]> {
    try {
      const url = `${this.baseUrl}?c=WallPaperAndroid&a=getAllCategories`;

      this.logger.log(`Fetching categories from: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        }),
      );
      const data = response.data.data;
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      return data.map((item: any) => ({
        id: item.id || item.cid,
        name: item.name || item.category_name,
        description: item.description || item.desc,
        count: item.count || 0,
        thumbUrl: item.thumb || item.thumbnail,
        provider: this.getProviderName(),
      }));
    } catch (error) {
      this.logger.error('Failed to fetch categories', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getWallpapersByCategory(
    cid = 'new',
    start = 0,
    count = 10,
  ): Promise<PaginatedResponse<WallpaperInfo>> {
    try {
      const url = `${this.baseUrl}?c=WallPaperAndroid&a=getAppsByCategory&cid=${cid}&start=${start}&count=${count}`;
      console.log(url);
      this.logger.log(`Fetching wallpapers by category: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        }),
      );

      const data = response.data.data;
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      const wallpapers: WallpaperInfo[] = data.map((item: any) => ({
        id: item.id || item.wallpaper_id,
        title: item.title || item.name,
        description: item.desc || item.description,
        url: item.url || item.img_url,
        thumbUrl: item.thumb || item.thumbnail,
        downloadUrl: item.download_url || item.url,
        width: item.width || 0,
        height: item.height || 0,
        fileSize: item.file_size || 0,
        category: cid,
        tags: item.tags ? item.tags.split(',') : [],
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        provider: this.getProviderName(),
      }));

      return {
        data: wallpapers,
        total: wallpapers.length,
        page: Math.floor(start / count) + 1,
        pageSize: count,
        hasNext: wallpapers.length === count,
        hasPrev: start > 0,
      };
    } catch (error) {
      this.logger.error('Failed to fetch wallpapers by category', error);
      throw new Error('Failed to fetch wallpapers by category');
    }
  }

  async searchWallpapers(
    keyword: string,
    start = 0,
    count = 10,
  ): Promise<PaginatedResponse<WallpaperInfo>> {
    try {
      const url = `${this.baseUrl}?c=WallPaper&a=search&kw=${encodeURIComponent(
        keyword,
      )}&start=${start}&count=${count}`;

      this.logger.log(`Searching wallpapers: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        }),
      );

      const data = response.data.data;
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      const wallpapers: WallpaperInfo[] = data.map((item: any) => ({
        id: item.id || item.wallpaper_id,
        title: item.title || item.name,
        description: item.desc || item.description,
        url: item.url || item.img_url,
        thumbUrl: item.thumb || item.thumbnail,
        downloadUrl: item.download_url || item.url,
        width: item.width || 0,
        height: item.height || 0,
        fileSize: item.file_size || 0,
        category: item.category || 'search',
        tags: item.tags ? item.tags.split(',') : [],
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        provider: this.getProviderName(),
      }));

      return {
        data: wallpapers,
        total: wallpapers.length,
        page: Math.floor(start / count) + 1,
        pageSize: count,
        hasNext: wallpapers.length === count,
        hasPrev: start > 0,
      };
    } catch (error) {
      this.logger.error('Failed to search wallpapers', error);
      throw new Error('Failed to search wallpapers');
    }
  }

  async getHotSearchKeywords(): Promise<HotSearchItem[]> {
    try {
      const url = `${this.baseUrl}?c=WallPaper&a=getHotSearch`;

      this.logger.log(`Fetching hot search keywords: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        }),
      );

      const data = response.data.data;
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      return data.map((item: any, index: number) => ({
        keyword: item.keyword || item.word || item,
        rank: index + 1,
        count: item.count || 0,
        provider: this.getProviderName(),
      }));
    } catch (error) {
      this.logger.error('Failed to fetch hot search keywords', error);
      throw new Error('Failed to fetch hot search keywords');
    }
  }
}
