import { Module } from '@nestjs/common';
import { FixerServiceController } from './fixer-service.controller';
import { FixerServiceService } from './fixer-service.service';

@Module({
  imports: [],
  controllers: [FixerServiceController],
  providers: [FixerServiceService],
})
export class FixerServiceModule {}
