import { Module } from '@nestjs/common';
import { OnceContextService } from './once_context.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnceContextEntity } from 'src/entities/ut_once_context';

@Module({
  imports: [TypeOrmModule.forFeature([OnceContextEntity])],
  providers: [OnceContextService],
  exports: [OnceContextService],
})
export class OnceContextModule {}
