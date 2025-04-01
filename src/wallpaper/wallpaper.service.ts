import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallpaper } from './entities/wallpaper.entity';

@Injectable()
export class WallpaperService {
  constructor(
    @InjectRepository(Wallpaper)
    private wallpaperRepository: Repository<Wallpaper>,
  ) {}

  async findAll(): Promise<Wallpaper[]> {
    return this.wallpaperRepository.find();
  }

  async findOne(id: string): Promise<Wallpaper> {
    const wallpaper = await this.wallpaperRepository.findOne({ where: { id } });
    if (!wallpaper) {
      throw new NotFoundException(`Wallpaper with ID ${id} not found`);
    }
    return wallpaper;
  }

  async create(wallpaper: Wallpaper): Promise<Wallpaper> {
    return this.wallpaperRepository.save(wallpaper);
  }

  async update(id: string, wallpaper: Partial<Wallpaper>): Promise<Wallpaper> {
    const existingWallpaper = await this.findOne(id);
    const updatedWallpaper = { ...existingWallpaper, ...wallpaper };
    return this.wallpaperRepository.save(updatedWallpaper);
  }

  async remove(id: string): Promise<void> {
    const result = await this.wallpaperRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wallpaper with ID ${id} not found`);
    }
  }
}