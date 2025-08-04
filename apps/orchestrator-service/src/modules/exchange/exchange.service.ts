import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);

  constructor(
    @Inject('FIXER_SERVICE') private fixerClient: ClientProxy,
    @Inject('EXCHANGERATE_SERVICE') private exchangerateClient: ClientProxy,
    @Inject('FLOATRATES_SERVICE') private floatratesClient: ClientProxy,
  ) {}

  private async sendRequest(
    client: ClientProxy,
    provider: string,
    from: string,
    to: string,
    amount: number,
  ) {
    try {
      this.logger.log(`Enviando solicitud a ${provider}...`);
      const result = await client
        .send({ cmd: 'convert' }, { from, to, amount })
        .toPromise();

      if (
        !result ||
        typeof result.convertedAmount !== 'number' ||
        typeof result.rate !== 'number'
      ) {
        this.logger.warn(`Respuesta invalida desde ${provider}`);
        return this.fallback(provider);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error desde ${provider}: ${error.message}`);
      return this.fallback(provider);
    }
  }

  private fallback(provider: string) {
    return {
      provider,
      rate: 0,
      convertedAmount: 0,
    };
  }

  async getBestRate(
    sourceCurrency: string,
    targetCurrency: string,
    amount: number,
  ) {
    this.logger.log('Consultando tasas de diferentes servicios...');

    const results = await Promise.all([
      this.sendRequest(this.fixerClient, 'Fixer', sourceCurrency, targetCurrency, amount),
      this.sendRequest(this.exchangerateClient, 'ExchangeRate-API', sourceCurrency, targetCurrency, amount),
      this.sendRequest(this.floatratesClient, 'FloatRates', sourceCurrency, targetCurrency, amount),
    ]);

    // Si todas fallaron (convertedAmount = 0), retorna la primera
    const best = results
      .filter(r => r.convertedAmount > 0)
      .sort((a, b) => b.convertedAmount - a.convertedAmount)[0];

    return best || this.fallback('Ninguno');
  }
}
