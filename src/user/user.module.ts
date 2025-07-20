import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ResModule } from 'src/res/res.module';
import { UsersModule } from 'src/RBAC/users/users.module';

@Module({
  imports: [ResModule, UsersModule],
  controllers: [UserController],
})
export class UserModule {} 