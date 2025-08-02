import { Module } from '@nestjs/common';
import { FixerServiceController } from './fixer-service.controller';
import { FixerService } from './fixer-service.service';

@Module({
  imports: [],
  controllers: [FixerServiceController],
  providers: [FixerService],
})
export class FixerServiceModule {}
