import { ProviderNormalizer } from 'aggregation/normalizers/provider-normalizer.interface';
import { NormalizedProduct } from '../../types';

export class ProviderCNormalizer implements ProviderNormalizer {
  normalize(raw: any): NormalizedProduct[] {
    const list = Array.isArray(raw.items) ? raw.items : [];

    return list.map((item) => {
      const amount = item?.pricing?.amount ?? '0';

      return {
        providerProductId: String(item.pid),
        name: item.meta?.title ?? 'Unknown',
        description: item.meta?.desc ?? null,
        price: Number(parseFloat(String(amount)) || 0),
        currency: item.currency ?? 'USD',
        availability: Number(item.available) === 1,
        lastUpdated: item.ts
          ? new Date(item.ts).toISOString()
          : new Date().toISOString(),
      };
    });
  }
}
