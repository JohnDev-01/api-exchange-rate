import { FixerService } from './fixer-service.service';
import axios from 'axios';
import * as retry from 'async-retry';

jest.mock('axios');
jest.mock('async-retry', () => (fn: any, opts: any) => fn());

describe('FixerService', () => {
  let service: FixerService;

  beforeEach(() => {
    service = new FixerService();
    process.env.FIXER_KEY = 'asdf';
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

    expect(result.provider).toBe('Fixer');
    expect(result.rate).toBeGreaterThan(0);
    expect(result.convertedAmount).toBeGreaterThan(0);
  });

  it('debe retornar fallback si las tasas son invalidas o faltan', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        success: false,
        rates: {},
      },
    });

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'Fixer',
      rate: 0,
      convertedAmount: 0,
    });
  });

  it('debe retornar fallback si axios lanza una excepcion', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await service.convert('USD', 'DOP', 100);

    expect(result).toEqual({
      provider: 'Fixer',
      rate: 0,
      convertedAmount: 0,
    });
  });
});
