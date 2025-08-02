import { Test, TestingModule } from '@nestjs/testing';
import { ExchangerateServiceController } from './exchangerate-service.controller';
import { ExchangerateService } from './exchangerate-service.service';

describe('ExchangerateServiceController', () => {
  let controller: ExchangerateServiceController;
  let service: ExchangerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangerateServiceController],
      providers: [
        {
          provide: ExchangerateService,
          useValue: {
            convert: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExchangerateServiceController>(ExchangerateServiceController);
    service = module.get<ExchangerateService>(ExchangerateService);
  });

  it('debe delegar a exchangerateService.convert', async () => {
    const payload = {
      from: 'USD',
      to: 'DOP',
      amount: 200,
    };

    const expected = {
      provider: 'ExchangeRate-API',
      rate: 56.5,
      convertedAmount: 11300,
    };

    (service.convert as jest.Mock).mockResolvedValue(expected);

    const result = await controller.handleConvert(payload);

    expect(service.convert).toHaveBeenCalledWith('USD', 'DOP', 200);
    expect(result).toEqual(expected);
  });
});
