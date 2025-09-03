import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { CrudModule } from 'src/utils/crud/crud.module';
import { ResModule } from 'src/res/res.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    CrudModule,
    ResModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
