import { NestFactory } from '@nestjs/core';
import { FixerServiceModule } from './fixer-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Inicia microservicio TCP
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    FixerServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );
  await microservice.listen();
  console.log('[TCP] FixerService microservice is listening on TCP port 3001');

  // Inicia servidor HTTP
  const httpApp = await NestFactory.create(FixerServiceModule);
  httpApp.useGlobalPipes(new ValidationPipe({ transform: true }));
  await httpApp.listen(3011);
  console.log('[HTTP] FixerService HTTP server is running on port 3011');
}
bootstrap();
