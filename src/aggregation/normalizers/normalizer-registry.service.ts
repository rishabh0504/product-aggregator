import { Injectable } from '@nestjs/common';
import { ProviderANormalizer } from './providerA.normalizer';
import { ProviderBNormalizer } from './providerB.normalizer';
import { ProviderCNormalizer } from './providerC.normalizer';
import { ProviderNormalizer } from './provider-normalizer.interface';

@Injectable()
export class NormalizerRegistry {
  private readonly registry: Record<string, ProviderNormalizer> = {
    'provider a': new ProviderANormalizer(),
    'provider b': new ProviderBNormalizer(),
    'provider c': new ProviderCNormalizer(),
  };

  normalize(providerName: string, raw: any) {
    const key = providerName.toLowerCase();

    for (const p of Object.keys(this.registry)) {
      if (key.startsWith(p)) {
        return this.registry[p].normalize(raw);
      }
    }

    return [];
  }
}
