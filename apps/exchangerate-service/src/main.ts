import { NestFactory } from '@nestjs/core';
import { ExchangerateServiceModule } from './exchangerate-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ExchangerateServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
