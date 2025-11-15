import { Test, TestingModule } from '@nestjs/testing';
import { ProviderBService } from './provider-b.service';

describe('ProviderBService', () => {
  let service: ProviderBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderBService],
    }).compile();

    service = module.get<ProviderBService>(ProviderBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
