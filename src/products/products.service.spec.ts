import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '@prisma-module/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockPrismaService = {
    product: {
      count: jest.fn().mockResolvedValue(0),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    priceHistory: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('listProducts should return data object', async () => {
    const result = await service.listProducts({ page: 1, limit: 10 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('getProductsChanges should return empty array', async () => {
    const changes = await service.getProductsChanges();
    expect(Array.isArray(changes)).toBe(true);
    expect(changes.length).toBe(0);
  });
});
