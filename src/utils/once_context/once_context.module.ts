import { Module } from '@nestjs/common';
import { OnceContextService } from './once_context.service';

@Module({
  providers: [OnceContextService],
})
export class OnceContextModule {}
