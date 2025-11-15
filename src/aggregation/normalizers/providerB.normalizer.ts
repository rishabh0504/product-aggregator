import { ProviderNormalizer } from 'aggregation/normalizers/provider-normalizer.interface';
import { NormalizedProduct } from '../../types';

export class ProviderBNormalizer implements ProviderNormalizer {
  normalize(raw: any): NormalizedProduct[] {
    const list = Array.isArray(raw.products) ? raw.products : [];

    return list.map((item) => ({
      providerProductId: String(item.product_id),
      name: item.title,
      description: null,
      price: Number(item.cost),
      currency: item.curr ?? 'USD',
      availability: Number(item.in_stock) === 1,
      lastUpdated: new Date(
        (Number(item.updated_at) || 0) * 1000,
      ).toISOString(),
    }));
  }
}
