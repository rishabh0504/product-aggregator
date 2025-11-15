import { Module } from '@nestjs/common';
import { ProviderAService } from './provider-a/provider-a.service';
import { ProviderBService } from './provider-b/provider-b.service';
import { ProviderCService } from './provider-c/provider-c.service';
import { ProviderCController } from './provider-c/provider-c.controller';
import { ProviderBController } from './provider-b/provider-b.controller';
import { ProviderAController } from './provider-a/provider-a.controller';

@Module({
  imports: [],
  providers: [ProviderAService, ProviderBService, ProviderCService],
  controllers: [ProviderCController, ProviderBController, ProviderAController],
})
export class MockProvidersModule {}
