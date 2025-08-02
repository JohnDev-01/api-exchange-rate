import { Module } from '@nestjs/common';
import { ExchangerateServiceController } from './exchangerate-service.controller';
import { ExchangerateService } from './exchangerate-service.service';

@Module({
  imports: [],
  controllers: [ExchangerateServiceController],
  providers: [ExchangerateService],
})
export class ExchangerateServiceModule {}
