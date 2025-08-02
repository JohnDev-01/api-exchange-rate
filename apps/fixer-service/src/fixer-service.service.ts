import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as retry from 'async-retry';

@Injectable()
export class FixerService {
  private readonly apiKey = process.env.FIXER_KEY;
  private readonly baseUrl = 'https://data.fixer.io/api/latest';

  async convert(from: string, to: string, amount: number) {
    try {
      return retry(
        async () => {
          Logger.log('Consultando FixerServiceService...');
          try {
            const response = await axios.get(this.baseUrl, {
              params: {
                access_key: this.apiKey,
                symbols: `${from},${to}`,
              },
              timeout: 5000,
            });

            const data = response.data;
            if (!data.success || !data.rates?.[from] || !data.rates?.[to]) {
              throw new Error(
                `Tasas no disponibles desde Fixer para ${from} - ${to}`,
              );
            }

            const rateFromEUR = 1 / data.rates[from];
            const rateTo = data.rates[to];

            const rate = rateFromEUR * rateTo;

            return {
              provider: 'Fixer',
              rate,
              convertedAmount: rate * amount,
            };
          } catch (error) {
            Logger.error(
              `El servicio FixerService ha fallado. Mas detalles: ${error}`,
              FixerService,
            );
            throw error;
          }
        },
        {
          retries: 2,
          minTimeout: 300,
          onRetry: (err, attempt) => {
            Logger.warn(
              `Reintentando ${attempt}/2 con el error: ${err.message}`,
              FixerService.name,
            );
          },
        },
      );
    } catch (error) {
      Logger.error(
        `El servicio FixerService ha fallado. Mas detalles: ${error}`,
        FixerService,
      );
      throw new Error(`FixerService: ${error.message}`);
    }
  }
}
