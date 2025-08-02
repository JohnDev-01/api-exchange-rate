import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as retry from 'async-retry';

@Injectable()
export class ExchangerateService {
  private readonly baseUrl = 'https://open.er-api.com/v6';
  private readonly logger = new Logger(ExchangerateService.name);

  async convert(from: string, to: string, amount: number) {
    try {
      return await retry(
        async () => {
          const url = `${this.baseUrl}/latest/${from}`;
          this.logger.log(`Consultando ExchangeRate-API para ${from} - ${to}`);

          const response = await axios.get(url, { timeout: 5000 });
          const data = response.data;

          if (
            data?.result !== 'success' ||
            typeof data.rates?.[to] !== 'number'
          ) {
            throw new Error(`Tasa no valida para ${to}`);
          }

          const rate = data.rates[to];

          return {
            provider: 'ExchangeRate-API',
            rate,
            convertedAmount: rate * amount,
          };
        },
        {
          retries: 2,
          minTimeout: 300,
          onRetry: (err, attempt) => {
            this.logger.warn(`Reintento ${attempt}/2 - Error: ${err.message}`);
          },
        },
      );
    } catch (error) {
      this.logger.error(
        `Fallo definitivo en ExchangerateService: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `ExchangerateService fallo al convertir de ${from} a ${to}`,
      );
    }
  }
}
