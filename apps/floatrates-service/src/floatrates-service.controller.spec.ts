import { Test, TestingModule } from '@nestjs/testing';
import { FloatratesServiceController } from './floatrates-service.controller';
import { FloatratesServiceService } from './floatrates-service.service';

describe('FloatratesServiceController', () => {
  let floatratesServiceController: FloatratesServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FloatratesServiceController],
      providers: [FloatratesServiceService],
    }).compile();

    floatratesServiceController = app.get<FloatratesServiceController>(FloatratesServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(floatratesServiceController.getHello()).toBe('Hello World!');
    });
  });
});
