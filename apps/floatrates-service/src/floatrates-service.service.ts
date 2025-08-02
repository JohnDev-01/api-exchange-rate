import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as retry from 'async-retry';

@Injectable()
export class FloatratesService {
  private readonly baseUrl = 'http://www.floatrates.com/daily';
  private readonly logger = new Logger(FloatratesService.name);

  async convert(from: string, to: string, amount: number) {
    try {
      return await retry(
        async () => {
          const url = `${this.baseUrl}/${from.toLowerCase()}.xml`;
          this.logger.log(`Consultando FloatRates para ${from} - ${to}`);

          const response = await axios.get(url, { timeout: 5000 });

          const parsed = await parseStringPromise(response.data, {
            explicitArray: false,
            explicitRoot: false,
          });

          const { item } = parsed;

          if (!item) {
            throw new Error('No se encontraron tasas en el XML de FloatRates.');
          }

          const itemArray = Array.isArray(item) ? item : [item];

          const targetItem = itemArray.find(
            (entry) =>
              entry?.targetCurrency?.toUpperCase() === to.toUpperCase(),
          );

          if (!targetItem || isNaN(parseFloat(targetItem.exchangeRate))) {
            throw new Error(`No se encontro tasa valida para ${to}`);
          }

          const rate = parseFloat(targetItem.exchangeRate);

          return {
            provider: 'FloatRates',
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
        `Fallo definitivo en FloatratesService: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `FloatratesService fallo al convertir de ${from} a ${to}`,
      );
    }
  }
}
