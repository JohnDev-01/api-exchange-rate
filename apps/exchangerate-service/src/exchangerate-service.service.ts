import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as retry from 'async-retry';

@Injectable()
export class ExchangerateService {
  private readonly baseUrl = process.env.EXCHANGERATE_BASE_URL;
  private readonly logger = new Logger(ExchangerateService.name);

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
    this.logger.log(`Consultando ExchangeRate para ${from} → ${to}`);

    const data = await this.fetchRates(from);
    const rate = this.extractRate(data, to);

    if (rate === null) {
      this.logger.warn(`Tasa inválida para ${to}`);
      return this.fallbackResponse();
    }

    return {
      provider: 'ExchangeRate-API',
      rate,
      convertedAmount: rate * amount,
    };
  }

  private async fetchRates(from: string) {
    const url = `${this.baseUrl}/latest/${from}`;
    const response = await axios.get(url, { timeout: 5000 });
    return response.data;
  }

  private extractRate(data: any, to: string): number | null {
    if (data?.result !== 'success') return null;
    const rate = data.rates?.[to];
    return typeof rate === 'number' ? rate : null;
  }

  private fallbackResponse() {
    return {
      provider: 'ExchangeRate-API',
      rate: 0,
      convertedAmount: 0,
    };
  }
}
