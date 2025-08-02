import { Controller, Get } from '@nestjs/common';
import { FixerServiceService } from './fixer-service.service';

@Controller()
export class FixerServiceController {
  constructor(private readonly fixerServiceService: FixerServiceService) {}

  @Get()
  getHello(): string {
    return this.fixerServiceService.getHello();
  }
}
