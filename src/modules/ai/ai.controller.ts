import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('weather')
  async getWeather(@Query('location') location: string) {
    return this.aiService.getWeather(location);
  }
}
