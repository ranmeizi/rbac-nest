import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { EmailService } from 'src/utils/email/email.service';
import { EmailModule } from 'src/utils/email/email.module';

@Module({
  imports: [UsersModule, RolesModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, EmailService],
})
export class AuthModule {}
