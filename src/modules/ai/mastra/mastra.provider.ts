import { Mastra } from '@mastra/core/mastra';
import { weatherAgent } from './agents/weather-agent';
import { nameFormattingWorkflow } from './workflows/name-formatting-workflow';
import { PinoLogger } from '@mastra/loggers';

export const MASTRA_TOKEN = 'MASTRA';

export const MastraProvider = {
  provide: MASTRA_TOKEN,
  useFactory: () => {
    return new Mastra({
      agents: { weatherAgent },
      workflows: { nameFormattingWorkflow },
      observability: {
        default: { enabled: true }, // Enables DefaultExporter and CloudExporter
      },
      logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
    });
  },
};
