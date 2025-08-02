import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FloatratesService } from './floatrates-service.service';

@Controller()
export class FloatratesServiceController {
  constructor(private readonly service: FloatratesService) {}

  @MessagePattern({ cmd: 'convert' })
  async convert(@Payload() payload: { from: string; to: string; amount: number }) {
    return this.service.convert(payload.from, payload.to, payload.amount);
  }
}
