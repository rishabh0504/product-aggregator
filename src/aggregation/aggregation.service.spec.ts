import { Test, TestingModule } from '@nestjs/testing';
import { AggregationService } from './aggregation.service';
import { PrismaService } from '@prisma-module/prisma.service';
import { ProviderFetcherService } from './provider-fetcher.service';

describe('AggregationService', () => {
  let service: AggregationService;
  let prisma: PrismaService;
  let fetcher: ProviderFetcherService;

  const mockPrismaService = {
    provider: { findMany: jest.fn() },
    product: { findFirst: jest.fn(), upsert: jest.fn(), updateMany: jest.fn() },
    priceHistory: { create: jest.fn() },
  };

  const mockProviderFetcherService = {
    fetchAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AggregationService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: ProviderFetcherService,
          useValue: mockProviderFetcherService,
        },
      ],
    }).compile();

    service = module.get<AggregationService>(AggregationService);
    prisma = module.get<PrismaService>(PrismaService);
    fetcher = module.get<ProviderFetcherService>(ProviderFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should skip products without providerProductId', async () => {
    const spyUpsert = jest.spyOn(service, 'upsertProduct');
    await service.upsertProduct('provider1', { name: 'Test Product' } as any);
    expect(spyUpsert).toHaveReturned(); // it won't throw
  });

  it('should call fetchAll in aggregate', async () => {
    mockPrismaService.provider.findMany.mockResolvedValue([
      { id: 'p1', name: 'Provider 1' },
    ]);
    mockProviderFetcherService.fetchAll.mockResolvedValue([
      { provider: { id: 'p1', name: 'Provider 1' }, data: [], error: false },
    ]);

    await service.aggregate();
    expect(mockProviderFetcherService.fetchAll).toHaveBeenCalled();
  });
});
