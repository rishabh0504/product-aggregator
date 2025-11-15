import { Test, TestingModule } from '@nestjs/testing';
import { ProviderCController } from './provider-c.controller';

describe('ProviderCController', () => {
  let controller: ProviderCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderCController],
    }).compile();

    controller = module.get<ProviderCController>(ProviderCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
