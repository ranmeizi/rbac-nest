import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyCode } from 'src/entities/verify_code.entity';
import { VerifyCodeLog } from 'src/entities/verify_code_log.entity';
import { EmailController } from './email.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VerifyCode, VerifyCodeLog])],
  providers: [EmailService],
  exports: [
    EmailService,
    TypeOrmModule.forFeature([VerifyCode, VerifyCodeLog]),
  ],
  controllers: [EmailController],
})
export class EmailModule {}
