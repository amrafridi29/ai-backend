import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

export const chatAgent = new Agent({
  name: 'Chat Agent',
  instructions: 'You are a helpful chat assistant.',
  model: openai('gpt-4.1-mini'),
  memory: new Memory({
    options: {
      threads: {
        generateTitle: true,
      },
      lastMessages: 50,
    },
  }),
});
