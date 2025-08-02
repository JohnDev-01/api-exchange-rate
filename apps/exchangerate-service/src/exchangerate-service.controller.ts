import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExchangerateService } from './exchangerate-service.service';

@Controller()
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
}
