import { Module } from '@nestjs/common';
import { FloatratesServiceController } from './floatrates-service.controller';
import { FloatratesService } from './floatrates-service.service';

@Module({
  imports: [],
  controllers: [FloatratesServiceController],
  providers: [FloatratesService],
})
export class FloatratesServiceModule {}
