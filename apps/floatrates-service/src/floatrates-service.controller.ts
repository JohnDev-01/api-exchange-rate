import { Controller, Get } from '@nestjs/common';
import { FloatratesServiceService } from './floatrates-service.service';

@Controller()
export class FloatratesServiceController {
  constructor(private readonly floatratesServiceService: FloatratesServiceService) {}

  @Get()
  getHello(): string {
    return this.floatratesServiceService.getHello();
  }
}
