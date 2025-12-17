import { Mastra } from '@mastra/core/mastra';
import { weatherAgent } from './agents/weather-agent';
import { nameFormattingWorkflow } from './workflows/name-formatting-workflow';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';

export const mastra = new Mastra({
  agents: { weatherAgent },
  workflows: { nameFormattingWorkflow },
  observability: {
    default: { enabled: true }, // Enables DefaultExporter and CloudExporter
  },
  storage: new LibSQLStore({
    url: 'file:./mastra.db', // Storage is required for tracing
  }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});
