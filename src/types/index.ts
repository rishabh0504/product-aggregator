export type NormalizedProduct = {
  providerProductId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  availability: boolean;
  lastUpdated: string; // ISO
};
