import { Module } from '@nestjs/common';
import { ExchangerateServiceController } from './exchangerate-service.controller';
import { ExchangerateServiceService } from './exchangerate-service.service';

@Module({
  imports: [],
  controllers: [ExchangerateServiceController],
  providers: [ExchangerateServiceService],
})
export class ExchangerateServiceModule {}
