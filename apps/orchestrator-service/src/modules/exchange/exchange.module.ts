import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FIXER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FIXER_HOST || 'fixer-service',
          port: Number(process.env.FIXER_PORT) || 3001,
        },
      },
      {
        name: 'EXCHANGERATE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.EXCHANGERATE_HOST || 'exchangerate-service',
          port: Number(process.env.EXCHANGERATE_PORT) || 3002,
        },
      },
      {
        name: 'FLOATRATES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FLOATRATES_HOST || 'floatrates-service',
          port: Number(process.env.FLOATRATES_PORT) || 3003,
        },
      },
    ]),
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
