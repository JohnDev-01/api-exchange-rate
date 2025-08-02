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
    (axios.get as jest.Mock).mockResolvedValue({
      data: '<xml></xml>',
    });

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

  it('debe lanzar error si no hay tasas en el XML', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: '<xml></xml>',
    });

    (parseStringPromise as jest.Mock).mockResolvedValue({});

    await expect(
      service.convert('USD', 'DOP', 100),
    ).rejects.toThrowError(
      /FloatratesService fallo al convertir de USD a DOP/,
    );
  });

  it('debe lanzar error si no encuentra la moneda de destino', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: '<xml></xml>',
    });

    (parseStringPromise as jest.Mock).mockResolvedValue({
      item: [
        {
          targetCurrency: 'EUR',
          exchangeRate: '1.2',
        },
      ],
    });

    await expect(
      service.convert('USD', 'DOP', 100),
    ).rejects.toThrowError(
      /FloatratesService fallo al convertir de USD a DOP/,
    );
  });

  it('debe lanzar error si la tasa es inválida', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: '<xml></xml>',
    });

    (parseStringPromise as jest.Mock).mockResolvedValue({
      item: [
        {
          targetCurrency: 'DOP',
          exchangeRate: 'not-a-number',
        },
      ],
    });

    await expect(
      service.convert('USD', 'DOP', 100),
    ).rejects.toThrowError(
      /FloatratesService fallo al convertir de USD a DOP/,
    );
  });

  it('debe manejar errores de red o de axios correctamente', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(
      service.convert('USD', 'DOP', 100),
    ).rejects.toThrowError(
      /FloatratesService fallo al convertir de USD a DOP/,
    );
  });
});
