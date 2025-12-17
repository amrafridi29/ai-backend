import { createStep, createWorkflow } from '@mastra/core';
import { z } from 'zod';

export const uppercaseStep = createStep({
  id: 'uppercase-step',
  description: 'Uppercase the name',
  inputSchema: z.object({
    name: z.string().describe('The name of the person'),
  }),
  outputSchema: z.object({
    formattedName: z.string().describe('The uppercase name of the person'),
  }),
  execute: async ({ inputData, mastra }) => {
    const { name } = inputData;
    mastra.getLogger().info('Uppercasing name', { name });
    return { formattedName: name.toUpperCase() };
  },
});

export const emphasizeStep = createStep({
  id: 'emphasize-step',
  description: 'Emphasize the name',
  inputSchema: z.object({
    formattedName: z.string().describe('The formatted name of the person'),
  }),
  outputSchema: z.object({
    emphasizedName: z.string().describe('The emphasized name of the person'),
  }),
  execute: async ({ inputData }) => {
    const { formattedName } = inputData;
    return { emphasizedName: `!!! ${formattedName} !!!` };
  },
});

export const nameFormattingWorkflow = createWorkflow({
  id: 'name-formatting-workflow',
  description: 'Format the name of the person',
  inputSchema: z.object({
    name: z.string().describe('The name of the person'),
  }),
  outputSchema: z.object({
    result: z.string().describe('The emphasized name of the person'),
  }),
})
  .then(uppercaseStep)
  .then(emphasizeStep)
  .commit();
