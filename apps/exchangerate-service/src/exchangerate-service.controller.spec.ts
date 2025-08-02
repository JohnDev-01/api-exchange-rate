import { Test, TestingModule } from '@nestjs/testing';
import { ExchangerateServiceController } from './exchangerate-service.controller';
import { ExchangerateServiceService } from './exchangerate-service.service';

describe('ExchangerateServiceController', () => {
  let exchangerateServiceController: ExchangerateServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExchangerateServiceController],
      providers: [ExchangerateServiceService],
    }).compile();

    exchangerateServiceController = app.get<ExchangerateServiceController>(ExchangerateServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(exchangerateServiceController.getHello()).toBe('Hello World!');
    });
  });
});
