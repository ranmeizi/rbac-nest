import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from 'src/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from 'src/entities/permission.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { permission } from 'process';
import { CrudModule } from 'src/utils/crud/crud.module';
import { ResModule } from 'src/res/res.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    PermissionsModule,
    CrudModule,
    ResModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
