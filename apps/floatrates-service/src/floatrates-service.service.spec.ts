import { FloatratesService } from './floatrates-service.service';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as retry from 'async-retry';

jest.mock('axios');
jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn(),
}));
jest.mock('async-retry', () => jest.fn((fn) => fn()));

describe('FloatratesService', () => {
  let service: FloatratesService;

  beforeEach(() => {
    service = new FloatratesService();
  });

  it('debe retornar el resultado correctamente', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: '<xml></xml>' });

    (parseStringPromise as jest.Mock).mockResolvedValue({
      item: [
        {
          targetCurrency: 'DOP',
          exchangeRate: '58.5',
        },
      ],
    });

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'FloatRates',
      rate: 58.5,
      convertedAmount: 5850,
    });
  });

  it('debe retornar fallback si no hay tasas en el XML', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: '<xml></xml>' });
    (parseStringPromise as jest.Mock).mockResolvedValue({});

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'FloatRates',
      rate: 0,
      convertedAmount: 0,
    });
  });

  it('debe retornar fallback si no encuentra la moneda de destino', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: '<xml></xml>' });
    (parseStringPromise as jest.Mock).mockResolvedValue({
      item: [
        {
          targetCurrency: 'EUR',
          exchangeRate: '1.2',
        },
      ],
    });

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'FloatRates',
      rate: 0,
      convertedAmount: 0,
    });
  });

  it('debe retornar fallback si la tasa es invalida', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: '<xml></xml>' });
    (parseStringPromise as jest.Mock).mockResolvedValue({
      item: [
        {
          targetCurrency: 'DOP',
          exchangeRate: 'not-a-number',
        },
      ],
    });

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'FloatRates',
      rate: 0,
      convertedAmount: 0,
    });
  });

  it('debe retornar fallback si axios lanza una excepcion', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'FloatRates',
      rate: 0,
      convertedAmount: 0,
    });
  });
});
