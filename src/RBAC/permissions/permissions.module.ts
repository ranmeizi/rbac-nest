import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { CrudModule } from 'src/utils/crud/crud.module';
import { ResModule } from 'src/res/res.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), CrudModule, ResModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
