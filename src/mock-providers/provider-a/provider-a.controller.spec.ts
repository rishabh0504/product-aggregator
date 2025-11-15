import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAController } from '../provider-a/provider-a.controller';
import { ProviderAService } from '../provider-a/provider-a.service';

describe('ProviderAController', () => {
  let controller: ProviderAController;

  const mockProviderAService = {
    getProducts: jest.fn().mockReturnValue([
      { id: 'p1', name: 'Product 1', price: 100 },
      { id: 'p2', name: 'Product 2', price: 200 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderAController],
      providers: [
        { provide: ProviderAService, useValue: mockProviderAService },
      ],
    }).compile();

    controller = module.get<ProviderAController>(ProviderAController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of products', () => {
    const result = controller.getProducts();
    expect(result).toEqual(mockProviderAService.getProducts());
    expect(mockProviderAService.getProducts).toHaveBeenCalled();
  });
});
