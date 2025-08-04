import { NestFactory } from '@nestjs/core';
import { FloatratesServiceModule } from './floatrates-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(FloatratesServiceModule);

  // Middleware global (validación de datos)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Conectar microservicio TCP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3003,
    },
  });

  await app.startAllMicroservices();
  console.log('[TCP] Floatrates microservice is running on port 3003');

  // Servidor HTTP (para pruebas locales)
  await app.listen(3013);
  console.log('[HTTP] Floatrates service is also available on port 3013');
}

bootstrap();
