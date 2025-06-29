import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OssService } from './oss.service';

@Controller('oss')
@UseGuards(AuthGuard('jwt'))
export class OssController {
  constructor(private oss: OssService) {}
  @Get('signature')
  getOssSignature() {
    return this.oss.getSignature();
  }
}
