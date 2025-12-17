import { Mastra } from '@mastra/core/mastra';
import { Injectable } from '@nestjs/common';
import { MASTRA_TOKEN } from './mastra/mastra.provider';
import { Inject } from '@nestjs/common';

@Injectable()
export class AiService {
  constructor(@Inject(MASTRA_TOKEN) private readonly mastra: Mastra) {}

  async getWeather(location: string) {
    const weatherAgent = this.mastra.getAgent('weatherAgent');
    const weather = await weatherAgent.generate(
      `Get the weather for ${location}`,
    );
    return weather;
  }
}
