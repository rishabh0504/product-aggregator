import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCService } from './provider-c.service';

describe('ProviderCService', () => {
  let service: ProviderCService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderCService],
    }).compile();

    service = module.get<ProviderCService>(ProviderCService);
    service.onModuleInit(); // <-- seed initial data
  });

  afterEach(() => {
    service.onModuleDestroy(); // <-- clear timer
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return items from getProducts', () => {
    const result = service.getProducts();
    expect(result).toHaveProperty('items');
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);

    const first = result.items[0];
    expect(first).toHaveProperty('pid');
    expect(first).toHaveProperty('meta');
    expect(first).toHaveProperty('pricing');
    expect(first).toHaveProperty('available');
    expect(first).toHaveProperty('ts');
  });
});
