import { FixerServiceController } from './fixer-service.controller';
import { FixerService } from './fixer-service.service';

describe('FixerServiceController', () => {
  let controller: FixerServiceController;
  let service: FixerService;

  beforeEach(() => {
    service = new FixerService();
    controller = new FixerServiceController(service);
  });

  it('debe delegar la conversion al servicio', async () => {
    const convertSpy = jest
      .spyOn(service, 'convert')
      .mockResolvedValue({ provider: 'Fixer', rate: 1, convertedAmount: 100 });

    const result = await controller.handleConvert({
      from: 'USD',
      to: 'DOP',
      amount: 100,
    });

    expect(convertSpy).toHaveBeenCalledWith('USD', 'DOP', 100);
    expect(result).toEqual({
      provider: 'Fixer',
      rate: 1,
      convertedAmount: 100,
    });
  });
});
