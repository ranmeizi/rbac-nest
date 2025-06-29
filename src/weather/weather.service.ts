// src/weather/weather.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { weatherCityUrl, weatherUrl } from 'src/constants';
import { generateJWTToken } from 'src/utils/token';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  async getWeather(city: string): Promise<any> {
    const url2 = `${weatherCityUrl}?location=${city}`;
    const token = await generateJWTToken();
    try {
      const responsetwo = await firstValueFrom(
        this.httpService.get(url2, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      const url = `${weatherUrl}?location=${parseFloat(
        responsetwo.data?.location?.[0]?.lon,
      ).toFixed(2)},${parseFloat(responsetwo.data?.location?.[0]?.lat).toFixed(
        2,
      )}&lang=zh`;
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return {
        data: response?.data?.hourly ?? [],
        city: responsetwo.data?.location?.[0],
      };
    } catch (error) {
      throw new Error(`获取天气数据失败: ${error.message}`);
    }
  }
}
