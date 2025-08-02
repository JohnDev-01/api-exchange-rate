import { FloatratesServiceController } from './floatrates-service.controller';
import { FloatratesService } from './floatrates-service.service';

describe('FloatratesServiceController', () => {
  let controller: FloatratesServiceController;
  let service: FloatratesService;

  beforeEach(() => {
    service = new FloatratesService();
    controller = new FloatratesServiceController(service);
  });

  it('debe delegar la conversion al servicio', async () => {
    const mockResult = {
      provider: 'FloatRates',
      rate: 60,
      convertedAmount: 6000,
    };
    jest
      .spyOn(service, 'convert')
      .mockResolvedValue(mockResult as any);

    const result = await controller.convert({
      from: 'USD',
      to: 'DOP',
      amount: 100,
    });

    expect(result).toEqual(mockResult);
    expect(service.convert).toHaveBeenCalledWith('USD', 'DOP', 100);
  });
});
