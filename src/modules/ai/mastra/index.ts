import 'dotenv/config';

import { Mastra } from '@mastra/core/mastra';
import { weatherAgent } from './agents/weather-agent';
import { nameFormattingWorkflow } from './workflows/name-formatting-workflow';
import { PinoLogger } from '@mastra/loggers';
import {
  clearAITracingRegistry,
  DefaultExporter,
  SamplingStrategyType,
  SensitiveDataFilter,
} from '@mastra/core/ai-tracing';
import { PostgresStore } from '@mastra/pg';
import { chatAgent } from './agents/chat-agent';

clearAITracingRegistry();

process.env.OTEL_SDK_DISABLED = 'true';

const DATABASE_URL = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const mastra = new Mastra({
  agents: { weatherAgent, chatAgent },
  workflows: { nameFormattingWorkflow },

  telemetry: { enabled: false },

  observability: {
    configs: {
      default: {
        serviceName: 'mastra',
        sampling: {
          type: SamplingStrategyType.RATIO,
          probability: 0.01, // 1%
        },
        processors: [new SensitiveDataFilter()],
        exporters: [new DefaultExporter()], // ✅ MUST be empty
      },
    },
  },

  storage: new PostgresStore({
    connectionString: DATABASE_URL,
  }),

  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});
