import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCService } from './provider-c.service';

describe('ProviderCService', () => {
  let service: ProviderCService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderCService],
    }).compile();

    service = module.get<ProviderCService>(ProviderCService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
