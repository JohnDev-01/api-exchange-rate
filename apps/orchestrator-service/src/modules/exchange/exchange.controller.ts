import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('bestExchange')
  async getBestExchange(
    @Query('sourceCurrency') sourceCurrency: string,
    @Query('targetCurrency') targetCurrency: string,
    @Query('amount') amount: string,
  ) {
    Logger.log('Call bestExchange endpoint');
    return this.exchangeService.getBestRate(
      sourceCurrency,
      targetCurrency,
      Number(amount),
    );
  }
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
