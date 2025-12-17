import { mastra } from './index';

export const MASTRA_TOKEN = 'MASTRA';

export const MastraProvider = {
  provide: MASTRA_TOKEN,
  useFactory: () => {
    return mastra;
  },
};
