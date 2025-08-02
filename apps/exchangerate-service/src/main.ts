import { NestFactory } from '@nestjs/core';
import { ExchangerateServiceModule } from './exchangerate-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ExchangerateServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002,
      },
    },
  );
  await app.listen();
  console.log('ExchangeRate microservice is listening on port 3002');
}
bootstrap();
