import { NestFactory } from '@nestjs/core';
import { FloatratesServiceModule } from './floatrates-service.module';

async function bootstrap() {
  const app = await NestFactory.create(FloatratesServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
