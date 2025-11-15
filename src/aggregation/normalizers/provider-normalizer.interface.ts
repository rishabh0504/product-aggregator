import { NormalizedProduct } from '../../types';

export interface ProviderNormalizer {
  normalize(raw: any): NormalizedProduct[];
}
