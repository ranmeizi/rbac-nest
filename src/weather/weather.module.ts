import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { ThrottlerModule } from '@nestjs/throttler';

import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    ThrottlerModule.forRoot([
      {
        ttl: 86400,
        // 每个用户在 ttl (默认一天)时间内最多请求 10 次
        limit: 100,
        getTracker: (req) => req.user?.id || req.ip, // 优先用 userId，否则用 IP
      },
    ]),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
