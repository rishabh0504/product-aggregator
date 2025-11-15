import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAService } from './provider-a.service';

describe('ProviderAService', () => {
  let service: ProviderAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderAService],
    }).compile();

    service = module.get<ProviderAService>(ProviderAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
