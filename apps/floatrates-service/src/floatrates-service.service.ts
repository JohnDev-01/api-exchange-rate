import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as retry from 'async-retry';

@Injectable()
export class FloatratesService {
  private readonly baseUrl = process.env.FLOATRATES_BASE_URL;
  private readonly logger = new Logger(FloatratesService.name);
  // Hace la llamada en xml
  async convert(from: string, to: string, amount: number) {
    try {
      return await retry(() => this.tryConvert(from, to, amount), {
        retries: 2,
        minTimeout: 300,
        onRetry: (err, attempt) => {
          this.logger.warn(`Reintento ${attempt}/2 - Error: ${err.message}`);
        },
      });
    } catch (error) {
      this.logger.error(`Fallo definitivo: ${error.message}`);
      return this.fallbackResponse();
    }
  }

  private async tryConvert(from: string, to: string, amount: number) {
    this.logger.log(`Consultando FloatRates para ${from} → ${to}`);

    const parsed = await this.fetchAndParseRates(from);
    const rate = this.extractRate(parsed, to);

    if (rate === null) {
      this.logger.warn(`Tasa no encontrada o inválida para ${to}`);
      return this.fallbackResponse();
    }

    return {
      provider: 'FloatRates',
      rate,
      convertedAmount: rate * amount,
    };
  }

  private async fetchAndParseRates(from: string) {
    const url = `${this.baseUrl}/${from.toLowerCase()}.xml`;
    const response = await axios.get(url, { timeout: 5000 });

    return await parseStringPromise(response.data, {
      explicitArray: false,
      explicitRoot: false,
    });
  }

  private extractRate(parsed: any, to: string): number | null {
    const items = Array.isArray(parsed.item) ? parsed.item : [parsed.item];

    const match = items.find(
      (entry) => entry?.targetCurrency?.toUpperCase() === to.toUpperCase(),
    );

    const rate = match ? parseFloat(match.exchangeRate) : NaN;
    return isNaN(rate) ? null : rate;
  }

  private fallbackResponse() {
    return {
      provider: 'FloatRates',
      rate: 0,
      convertedAmount: 0,
    };
  }
}
