import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from 'src/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from 'src/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Permission]),
  ],
  controllers: [RolesController],
  providers: [RolesService, PermissionsService],
})
export class RolesModule {}
