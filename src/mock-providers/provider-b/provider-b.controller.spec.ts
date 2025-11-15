import { Test, TestingModule } from '@nestjs/testing';
import { ProviderBController } from './provider-b.controller';

describe('ProviderBController', () => {
  let controller: ProviderBController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderBController],
    }).compile();

    controller = module.get<ProviderBController>(ProviderBController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
