import { ProviderNormalizer } from 'aggregation/normalizers/provider-normalizer.interface';
import { NormalizedProduct } from '../../types';

export class ProviderANormalizer implements ProviderNormalizer {
  normalize(raw: any): NormalizedProduct[] {
    if (!Array.isArray(raw)) return [];

    return raw.map((item) => ({
      providerProductId: String(item.id),
      name: item.name,
      description: item.description ?? null,
      price: Number(item.price),
      currency: item.currency ?? 'USD',
      availability: Boolean(item.availability),
      lastUpdated: new Date(item.lastUpdated).toISOString(),
    }));
  }
}
