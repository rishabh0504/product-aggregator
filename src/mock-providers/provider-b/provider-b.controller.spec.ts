import { Test, TestingModule } from '@nestjs/testing';
import { ProviderBController } from './provider-b.controller';
import { ProviderBService } from './provider-b.service';

describe('ProviderBController', () => {
  let controller: ProviderBController;
  let service: ProviderBService;

  const mockService = {
    getProducts: jest.fn().mockReturnValue({ products: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderBController],
      providers: [{ provide: ProviderBService, useValue: mockService }],
    }).compile();

    controller = module.get<ProviderBController>(ProviderBController);
    service = module.get<ProviderBService>(ProviderBService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.getProducts and return its result', () => {
    const result = controller.getProducts();
    expect(service.getProducts).toHaveBeenCalled();
    expect(result).toEqual({ products: [] });
  });
});
