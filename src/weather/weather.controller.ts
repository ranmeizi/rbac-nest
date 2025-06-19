import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('weather')
@UseGuards(ThrottlerGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @Get()
  async getWeather(@Query('location') location: string) {
    if (!location) {
      throw new Error('Missing query parameter: location');
    }
    return this.weatherService.getWeather(location);
  }
}
