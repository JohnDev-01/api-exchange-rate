import { NestFactory } from '@nestjs/core';
import { FloatratesServiceModule } from './floatrates-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FloatratesServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3003,
      },
    },
  );
  await app.listen();
  console.log('Floatrates microservice is listening on port 3003');
}
bootstrap();
