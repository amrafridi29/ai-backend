import { Mastra } from '@mastra/core/mastra';
import { weatherAgent } from './agents/weather-agent';
import { nameFormattingWorkflow } from './workflows/name-formatting-workflow';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import {
  CloudExporter,
  DefaultExporter,
  SamplingStrategyType,
  SensitiveDataFilter,
} from '@mastra/core/ai-tracing';

export const mastra = new Mastra({
  agents: { weatherAgent },
  workflows: { nameFormattingWorkflow },
  observability: {
    configs: {
      default: {
        serviceName: 'mastra',
        sampling: { type: SamplingStrategyType.ALWAYS },
        processors: [new SensitiveDataFilter()],
        exporters: [new CloudExporter(), new DefaultExporter()],
      },
    },
  },

  storage: new LibSQLStore({
    url: 'file:./mastra.db', // Storage is required for tracing
  }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});
