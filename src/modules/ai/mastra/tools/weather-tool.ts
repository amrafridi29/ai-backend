import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
  execute: async ({ context }) => {
    const { location } = context;

    const response = await fetch(`https://wttr.in/${location}?format=3`);
    const weather = await response.text();

    console.log(response);

    return { weather };
  },
});
