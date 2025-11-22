import { Module } from '@nestjs/common';
import { JsonUploadService } from './json-upload.service';
import { JsonUploadController } from './json-upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOss } from '../entities/user_oss.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOss])],
  controllers: [JsonUploadController],
  providers: [JsonUploadService],
})
export class JsonUploadModule {}
