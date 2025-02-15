import { Module } from '@nestjs/common';
import { WiseService } from './wise.service';
import { WiseController } from './wise.controller';

@Module({
  controllers: [WiseController],
  providers: [WiseService],
})
export class WiseModule {}
