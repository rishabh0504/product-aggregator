import { Test, TestingModule } from '@nestjs/testing';
import { ProviderBService } from './provider-b.service';

describe('ProviderBService', () => {
  let service: ProviderBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderBService],
    }).compile();

    service = module.get<ProviderBService>(ProviderBService);
    service.onModuleInit(); // manually trigger init since timer/mutation won't run in test
  });

  afterEach(() => {
    service.onModuleDestroy(); // clean up timer
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return products', () => {
    const result = service.getProducts();
    expect(result).toHaveProperty('products');
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products[0]).toHaveProperty('product_id');
    expect(result.products[0]).toHaveProperty('title');
    expect(result.products[0]).toHaveProperty('cost');
    expect(result.products[0]).toHaveProperty('curr');
  });

  it('should return a copy, not reference', () => {
    const products1 = service.getProducts();
    const products2 = service.getProducts();
    expect(products1.products).not.toBe(products2.products); // new array each call
    expect(products1.products[0]).not.toBe(products2.products[0]); // new object copies
  });
});
