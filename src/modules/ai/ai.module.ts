import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MastraProvider } from './mastra/mastra.provider';
import { AiController } from './ai.controller';
import { RagProvider } from './mastra/rag/rag.provider';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [AiService, MastraProvider, RagProvider],
  exports: [AiService, MastraProvider],
})
export class AiModule {}
