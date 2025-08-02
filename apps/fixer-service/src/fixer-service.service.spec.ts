import { FixerService } from './fixer-service.service';
import axios from 'axios';
import * as retry from 'async-retry';

jest.mock('axios');
jest.mock('async-retry', () => (fn: any, opts: any) => fn());

describe('FixerService', () => {
  let service: FixerService;

  beforeEach(() => {
    service = new FixerService();
    process.env.FIXER_KEY = 'asfasd';
  });

  it('debe retornar el resultado convertido correctamente', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        rates: {
          USD: 1.2,
          DOP: 60,
        },
      },
    });

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'Fixer',
      rate: expect.any(Number),
      convertedAmount: expect.any(Number),
    });
  });

  it('debe lanzar un error si las tasas estan ausentes o invalidas', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        success: false,
        rates: {},
      },
    });

    await expect(service.convert('USD', 'DOP', 100)).rejects.toThrowError(
      /Tasas no disponibles/,
    );
  });

  it('debe manejar excepciones de axios adecuadamente', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(service.convert('USD', 'DOP', 100)).rejects.toThrowError(
      /Network error/,
    );
  });
});
