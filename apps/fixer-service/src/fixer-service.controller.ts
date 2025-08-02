import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FixerService } from './fixer-service.service';

@Controller()
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
}
