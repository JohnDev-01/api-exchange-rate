import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as retry from 'async-retry';

@Injectable()
export class FixerService {
  private readonly apiKey = process.env.FIXER_KEY;
  private readonly baseUrl = process.env.FIXER_BASE_URL;
  private readonly logger = new Logger(FixerService.name);

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
    this.logger.log(`Consultando Fixer para ${from} → ${to}`);
    const data = await this.fetchRates(from, to);

    if (!this.validRates(data, from, to)) {
      this.logger.warn(`Tasas inválidas desde Fixer para ${from} → ${to}`);
      return this.fallbackResponse();
    }

    return this.buildConversionResponse(data, from, to, amount);
  }

  private async fetchRates(from: string, to: string) {
    const response = await axios.get(this.baseUrl, {
      params: {
        access_key: this.apiKey,
        symbols: `${from},${to}`,
      },
      timeout: 5000,
    });

    return response.data;
  }

  private validRates(data: any, from: string, to: string): boolean {
    return (
      data?.success &&
      typeof data.rates?.[from] === 'number' &&
      typeof data.rates?.[to] === 'number'
    );
  }

  private buildConversionResponse(
    data: any,
    from: string,
    to: string,
    amount: number,
  ) {
    const rateFromEUR = 1 / data.rates[from];
    const rateTo = data.rates[to];
    const rate = rateFromEUR * rateTo;

    return {
      provider: 'Fixer',
      rate,
      convertedAmount: rate * amount,
    };
  }

  private fallbackResponse() {
    return {
      provider: 'Fixer',
      rate: 0,
      convertedAmount: 0,
    };
  }
}
