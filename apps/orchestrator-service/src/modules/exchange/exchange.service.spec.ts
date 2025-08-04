import { ExchangeService } from './exchange.service';
import { ClientProxy } from '@nestjs/microservices';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let fixerClient: jest.Mocked<ClientProxy>;
  let exchangerateClient: jest.Mocked<ClientProxy>;
  let floatratesClient: jest.Mocked<ClientProxy>;

  beforeEach(() => {
    const makeMockClient = () => ({
      send: jest.fn(),
    }) as unknown as jest.Mocked<ClientProxy>;

    fixerClient = makeMockClient();
    exchangerateClient = makeMockClient();
    floatratesClient = makeMockClient();

    service = new ExchangeService(
      fixerClient,
      exchangerateClient,
      floatratesClient,
    );
  });

  function mockToPromise(
    client: jest.Mocked<ClientProxy>,
    resultado: any,
  ) {
    if (resultado instanceof Error) {
      client.send.mockReturnValue({
        toPromise: () => Promise.reject(resultado),
      } as any);
    } else {
      client.send.mockReturnValue({
        toPromise: () => Promise.resolve(resultado),
      } as any);
    }
  }

  it('debe seleccionar la mejor tasa de los proveedores exitosos', async () => {
    mockToPromise(fixerClient, { provider: 'Fixer', rate: 2, convertedAmount: 200 });
    mockToPromise(exchangerateClient, { provider: 'ExchangeRate-API', rate: 3, convertedAmount: 300 });
    mockToPromise(floatratesClient, { provider: 'FloatRates', rate: 1, convertedAmount: 100 });

    const mejor = await service.getBestRate('USD', 'EUR', 100);
    expect(mejor).toEqual({ provider: 'ExchangeRate-API', rate: 3, convertedAmount: 300 });
  });

  it('debe continuar si un proveedor falla y escoger el mejor entre los restantes', async () => {
    mockToPromise(fixerClient, new Error('fuera de servicio'));
    mockToPromise(exchangerateClient, { provider: 'ExchangeRate-API', rate: 5, convertedAmount: 500 });
    mockToPromise(floatratesClient, { provider: 'FloatRates', rate: 4, convertedAmount: 400 });

    const mejor = await service.getBestRate('USD', 'GBP', 100);
    expect(mejor).toEqual({ provider: 'ExchangeRate-API', rate: 5, convertedAmount: 500 });
    expect(fixerClient.send).toHaveBeenCalled();
  });

  it('debe devolver un fallback si todos los proveedores fallan', async () => {
    mockToPromise(fixerClient, new Error('fallo'));
    mockToPromise(exchangerateClient, new Error('fallo'));
    mockToPromise(floatratesClient, new Error('fallo'));

    const mejor = await service.getBestRate('USD', 'JPY', 100);
    expect(mejor).toEqual({ provider: 'Ninguno', rate: 0, convertedAmount: 0 });
  });

  it('debe aplicar fallback si un proveedor responde con datos inválidos', async () => {
    mockToPromise(fixerClient, { foo: 'bar' });
    mockToPromise(exchangerateClient, { provider: 'ER', rate: 0, convertedAmount: 0 });
    mockToPromise(floatratesClient, { provider: 'FloatRates', rate: 1, convertedAmount: 100 });

    const mejor = await service.getBestRate('USD', 'CAD', 200);
    expect(mejor).toEqual({ provider: 'FloatRates', rate: 1, convertedAmount: 100 });
  });
});
