import { NestFactory } from '@nestjs/core';
import { FixerServiceModule } from './fixer-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FixerServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );
  await app.listen();
  console.log('FixerService microservice is listening on TCP port 3001');
}
bootstrap();
