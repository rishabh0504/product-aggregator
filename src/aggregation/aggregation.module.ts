import { Module } from '@nestjs/common';
import { ProviderFetcherService } from './provider-fetcher.service';
import { AggregationService } from './aggregation.service';
import { HealthProbeService } from './health-probe.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NormalizerRegistry } from './normalizers/normalizer-registry.service';
// optionally metrics module

@Module({
  imports: [PrismaModule],
  providers: [
    ProviderFetcherService,
    AggregationService,
    HealthProbeService,
    NormalizerRegistry,
  ],
  exports: [ProviderFetcherService, NormalizerRegistry],
})
export class AggregationModule {}
