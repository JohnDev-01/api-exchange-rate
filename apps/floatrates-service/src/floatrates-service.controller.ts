import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FloatratesService } from './floatrates-service.service';

@Controller('floatrates')
export class FloatratesServiceController {
  constructor(private readonly service: FloatratesService) {}

  @MessagePattern({ cmd: 'convert' })
  async convert(@Payload() payload: { from: string; to: string; amount: number }) {
    return this.service.convert(payload.from, payload.to, payload.amount);
  }

  @Get('convert')
  async httpConvert(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ) {
    return this.service.convert(from, to, Number(amount));
  }
}
