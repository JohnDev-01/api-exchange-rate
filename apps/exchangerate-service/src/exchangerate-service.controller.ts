import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExchangerateService } from './exchangerate-service.service';

@Controller('exchangerate')
export class ExchangerateServiceController {
  constructor(
    private readonly exchangerateService: ExchangerateService,
  ) {}

  @MessagePattern({ cmd: 'convert' })
  async handleConvert(
    @Payload()
    payload: {
      from: string;
      to: string;
      amount: number;
    },
  ) {
    return this.exchangerateService.convert(
      payload.from,
      payload.to,
      payload.amount,
    );
  }

  @Get('convert')
  async httpConvert(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ) {
    return this.exchangerateService.convert(from, to, Number(amount));
  }
}
