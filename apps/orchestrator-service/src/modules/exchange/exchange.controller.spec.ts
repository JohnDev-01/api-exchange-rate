import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeService,
          useValue: {
            getBestRate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
  });

  it('debe delegar la logica al servicio', async () => {
    const mockResult = {
      provider: 'Fixer',
      rate: 58.5,
      convertedAmount: 5850,
    };

    jest
      .spyOn(service, 'getBestRate')
      .mockResolvedValueOnce(mockResult);

    const response = await controller.getBestExchange('USD', 'DOP', '100');

    expect(service.getBestRate).toHaveBeenCalledWith('USD', 'DOP', 100);
    expect(response).toEqual(mockResult);
  });
});
