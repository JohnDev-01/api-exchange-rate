import { Module } from '@nestjs/common';
import { FloatratesServiceController } from './floatrates-service.controller';
import { FloatratesServiceService } from './floatrates-service.service';

@Module({
  imports: [],
  controllers: [FloatratesServiceController],
  providers: [FloatratesServiceService],
})
export class FloatratesServiceModule {}
