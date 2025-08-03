import { Controller, Get, Logger, Query, ValidationPipe } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { GetBestExchangeDto } from './dto/get-best-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('bestExchange')
  async getBestExchange(
    @Query(new ValidationPipe({ transform: true }))
    query: GetBestExchangeDto,
  ) {
    Logger.log('Call bestExchange endpoint');
    const { sourceCurrency, targetCurrency, amount } = query;
    return this.exchangeService.getBestRate(
      sourceCurrency,
      targetCurrency,
      amount,
    );
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
