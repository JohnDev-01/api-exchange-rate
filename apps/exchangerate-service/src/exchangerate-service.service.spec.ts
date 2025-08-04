import { ExchangerateService } from './exchangerate-service.service';
import axios from 'axios';
import * as retry from 'async-retry';

jest.mock('axios');
jest.mock('async-retry');

describe('ExchangerateService', () => {
  let service: ExchangerateService;

  beforeEach(() => {
    service = new ExchangerateService();
  });

  it('debe retornar el resultado de conversión correctamente', async () => {
    const mockRate = 56.5;
    const mockResponse = {
      data: {
        result: 'success',
        rates: { DOP: mockRate },
      },
    };

    (retry as jest.MockedFunction<any>).mockImplementation(async (fn) => fn());
    (axios.get as jest.MockedFunction<any>).mockResolvedValue(mockResponse);

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'ExchangeRate-API',
      rate: mockRate,
      convertedAmount: mockRate * 100,
    });
  });

  it('debe retornar fallback si la API no retorna tasa valida', async () => {
    const mockResponse = {
      data: {
        result: 'error',
        rates: {},
      },
    };

    (retry as jest.MockedFunction<any>).mockImplementation(async (fn) => fn());
    (axios.get as jest.MockedFunction<any>).mockResolvedValue(mockResponse);

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'ExchangeRate-API',
      rate: 0,
      convertedAmount: 0,
    });
  });

  it('debe retornar fallback si axios lanza una excepcion', async () => {
    (retry as jest.MockedFunction<any>).mockImplementation(async (fn) => fn());
    (axios.get as jest.MockedFunction<any>).mockRejectedValue(new Error('Network Error'));

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'ExchangeRate-API',
      rate: 0,
      convertedAmount: 0,
    });
  });
});
