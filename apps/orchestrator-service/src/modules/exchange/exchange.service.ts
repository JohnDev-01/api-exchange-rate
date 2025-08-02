import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ExchangeService {
  constructor(
    @Inject('FIXER_SERVICE') private fixerClient: ClientProxy,
    @Inject('EXCHANGERATE_SERVICE') private exchangerateClient: ClientProxy,
    @Inject('FLOATRATES_SERVICE') private floatratesClient: ClientProxy,
  ) {}

  async getFixerRate(from: string, to: string, amount: number) {
    return this.fixerClient
      .send({ cmd: 'convert' }, { from, to, amount })
      .toPromise();
  }

  async getExchangeRate(from: string, to: string, amount: number) {
    return this.exchangerateClient
      .send({ cmd: 'convert' }, { from, to, amount })
      .toPromise();
  }

  async getFloatRate(from: string, to: string, amount: number) {
    return this.floatratesClient
      .send({ cmd: 'convert' }, { from, to, amount })
      .toPromise();
  }

  async getBestRate(
    sourceCurrency: string,
    targetCurrency: string,
    amount: number,
  ) {
    Logger.log('Consultando tasas de diferentes servicios');
    const results = await Promise.allSettled([
      this.getFixerRate(sourceCurrency, targetCurrency, amount),
      this.getExchangeRate(sourceCurrency, targetCurrency, amount),
      this.getFloatRate(sourceCurrency, targetCurrency, amount),
    ]);

    const successful = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (successful.length === 0) throw new Error('No hay tasas disponibles');

    return successful.sort((a, b) => a.convertedAmount - b.convertedAmount)[0];
  }
}
