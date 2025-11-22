import { Controller, Get, UseGuards } from '@nestjs/common';
import { JsonUploadService } from './json-upload.service';
import { JwtAuthGuard } from '../guards/jwt/jwt.guard';
import { CurrentUser } from '../decorators/currentUser.decorator';

@Controller('/user/json')
export class JsonUploadController {
  constructor(private readonly oss: JsonUploadService) {}

  /**
   * 获取 JSON 上传地址
   */
  @Get('upload-url')
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(@CurrentUser() user: { id: string }) {
    return this.oss.getJsonUploadUrl(user.id);
  }

  /**
   * 获取 JSON 下载地址
   */
  @Get('download-url')
  @UseGuards(JwtAuthGuard)
  async getDownloadUrl(@CurrentUser() user: { id: string }) {
    return this.oss.getJsonDownloadUrl(user.id);
  }
}
