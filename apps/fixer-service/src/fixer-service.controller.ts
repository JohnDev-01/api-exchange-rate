import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FixerService } from './fixer-service.service';

@Controller('fixer')
export class FixerServiceController {
  constructor(private readonly fixerService: FixerService) {}

  @MessagePattern({ cmd: 'convert' })
  async handleConvert(
    @Payload()
    payload: {
      from: string;
      to: string;
      amount: number;
    },
  ) {
    return this.fixerService.convert(payload.from, payload.to, payload.amount);
  }

  @Get('convert')
  async httpConvert(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ) {
    return this.fixerService.convert(from, to, Number(amount));
  }
}
