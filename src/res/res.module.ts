import { Global, Module } from '@nestjs/common';
import { ResService } from './res.service';

@Global()
@Module({
  providers: [ResService],
  exports: [ResService],
})
export class ResModule {}
