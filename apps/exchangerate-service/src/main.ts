import { NestFactory } from '@nestjs/core';
import { ExchangerateServiceModule } from './exchangerate-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExchangerateServiceModule);

  // Validación global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Microservicio TCP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3002,
    },
  });

  await app.startAllMicroservices();
  console.log('[TCP] ExchangeRate microservice is running on port 3002');

  // Servidor HTTP para pruebas
  await app.listen(3012);
  console.log('[HTTP] ExchangeRate service is also available on port 3012');
}

bootstrap();
