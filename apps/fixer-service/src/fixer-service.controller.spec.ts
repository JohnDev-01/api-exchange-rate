import { Test, TestingModule } from '@nestjs/testing';
import { FixerServiceController } from './fixer-service.controller';
import { FixerServiceService } from './fixer-service.service';

describe('FixerServiceController', () => {
  let fixerServiceController: FixerServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FixerServiceController],
      providers: [FixerServiceService],
    }).compile();

    fixerServiceController = app.get<FixerServiceController>(FixerServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fixerServiceController.getHello()).toBe('Hello World!');
    });
  });
});
