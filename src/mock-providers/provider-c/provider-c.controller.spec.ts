import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCController } from './provider-c.controller';
import { ProviderCService } from './provider-c.service';

describe('ProviderCController', () => {
  let controller: ProviderCController;
  let service: ProviderCService;

  beforeEach(async () => {
    const mockService = {
      getProducts: jest
        .fn()
        .mockReturnValue([{ id: 'c-1', name: 'Mock Product' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderCController],
      providers: [{ provide: ProviderCService, useValue: mockService }],
    }).compile();

    controller = module.get<ProviderCController>(ProviderCController);
    service = module.get<ProviderCService>(ProviderCService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return products from the service', () => {
    const result = controller.getProducts();
    expect(result).toEqual([{ id: 'c-1', name: 'Mock Product' }]);
    expect(service.getProducts).toHaveBeenCalled();
  });
});
