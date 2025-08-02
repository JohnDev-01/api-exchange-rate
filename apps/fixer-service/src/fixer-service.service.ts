import { Injectable } from '@nestjs/common';

@Injectable()
export class FixerServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
