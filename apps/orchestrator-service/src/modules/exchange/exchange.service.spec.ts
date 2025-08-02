import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { ClientProxy } from '@nestjs/microservices';

describe('ExchangeService', () => {
  let service: ExchangeService;

  const mockClient = () => ({
    send: jest.fn(() => ({
      toPromise: jest.fn(),
    })),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: 'FIXER_SERVICE', useFactory: mockClient },
        { provide: 'EXCHANGERATE_SERVICE', useFactory: mockClient },
        { provide: 'FLOATRATES_SERVICE', useFactory: mockClient },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
  });

  it('debe retornar la mejor tasa de entre los servicios', async () => {
    jest.spyOn(service, 'getFixerRate').mockResolvedValue({
      provider: 'Fixer',
      rate: 58.5,
      convertedAmount: 5850,
    });

    jest.spyOn(service, 'getExchangeRate').mockResolvedValue({
      provider: 'ExchangeRate-API',
      rate: 59,
      convertedAmount: 5900,
    });

    jest.spyOn(service, 'getFloatRate').mockResolvedValue({
      provider: 'FloatRates',
      rate: 57.2,
      convertedAmount: 5720,
    });

    const result = await service.getBestRate('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'FloatRates',
      rate: 57.2,
      convertedAmount: 5720,
    });
  });

  it('debe lanzar un error si ningun proveedor responde', async () => {
    jest.spyOn(service, 'getFixerRate').mockRejectedValue(new Error());
    jest.spyOn(service, 'getExchangeRate').mockRejectedValue(new Error());
    jest.spyOn(service, 'getFloatRate').mockRejectedValue(new Error());

    await expect(
      service.getBestRate('USD', 'DOP', 100),
    ).rejects.toThrow('No hay tasas disponibles');
  });
});
