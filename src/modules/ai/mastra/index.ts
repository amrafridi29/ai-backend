import 'dotenv/config';

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
import { PostgresStore } from '@mastra/pg';

const DATABASE_URL = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const mastra = new Mastra({
  agents: { weatherAgent },
  workflows: { nameFormattingWorkflow },
  // observability: {
  //   configs: {
  //     dev: {
  //       serviceName: 'mastra',
  //       sampling: { type: SamplingStrategyType.ALWAYS },
  //       processors: [new SensitiveDataFilter()],
  //       exporters: [new CloudExporter(), new DefaultExporter()],
  //     },
  //   },
  // },

  // storage: new LibSQLStore({
  //   url: 'file:./mastra.db', // Storage is required for tracing
  // }),
  storage: new PostgresStore({
    connectionString: DATABASE_URL,
  }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});
