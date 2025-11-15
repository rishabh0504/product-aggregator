import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAController } from '../provider-a/provider-a.controller';

describe('ProviderAController', () => {
  let controller: ProviderAController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderAController],
    }).compile();

    controller = module.get<ProviderAController>(ProviderAController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
