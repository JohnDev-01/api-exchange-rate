import { Controller, Get } from '@nestjs/common';
import { ExchangerateServiceService } from './exchangerate-service.service';

@Controller()
export class ExchangerateServiceController {
  constructor(private readonly exchangerateServiceService: ExchangerateServiceService) {}

  @Get()
  getHello(): string {
    return this.exchangerateServiceService.getHello();
  }
}
