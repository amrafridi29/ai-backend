import { Mastra } from '@mastra/core/mastra';
import { weatherAgent } from './agents/weather-agent';

export const MASTRA_TOKEN = 'MASTRA';

export const MastraProvider = {
  provide: MASTRA_TOKEN,
  useFactory: () => {
    return new Mastra({
      agents: { weatherAgent },
    });
  },
};
