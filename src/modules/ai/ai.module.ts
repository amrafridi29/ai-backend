import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { MastraProvider } from './mastra/mastra.provider';
import { AiController } from './ai.controller';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [AiService, MastraProvider],
  exports: [AiService, MastraProvider],
})
export class AiModule {}
