import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAService } from './provider-a.service';

describe('ProviderAService', () => {
  let service: ProviderAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderAService],
    }).compile();

    service = module.get<ProviderAService>(ProviderAService);

    // Manually call lifecycle hooks in unit test
    service.onModuleInit();
  });

  afterEach(() => {
    // Stop the interval to prevent Jest from hanging
    service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of products', () => {
    const products = service.getProducts();
    expect(products).toHaveLength(8);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
  });

  it('should return fresh objects (no references)', () => {
    const products1 = service.getProducts();
    const products2 = service.getProducts();
    expect(products1[0]).not.toBe(products2[0]); // each call returns a copy
  });
});
