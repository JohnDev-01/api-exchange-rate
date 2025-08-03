import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { GetBestExchangeDto } from './dto/get-best-exchange.dto';

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

  it('debe delegar la logica al servicio con DTO valido', async () => {
    const mockDto: GetBestExchangeDto = {
      sourceCurrency: 'USD',
      targetCurrency: 'DOP',
      amount: 100,
    };

    const mockResult = {
      provider: 'Fixer',
      rate: 58.5,
      convertedAmount: 5850,
    };

    jest.spyOn(service, 'getBestRate').mockResolvedValueOnce(mockResult);

    const response = await controller.getBestExchange(mockDto);

    expect(service.getBestRate).toHaveBeenCalledWith(
      mockDto.sourceCurrency,
      mockDto.targetCurrency,
      mockDto.amount,
    );
    expect(response).toEqual(mockResult);
  });
});
