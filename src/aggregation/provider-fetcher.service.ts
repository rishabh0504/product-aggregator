import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Provider } from '@prisma/client';
import { PrismaService } from '@prisma-module/prisma.service';
import { sleep } from '@common/utils';
import { NormalizerRegistry } from './normalizers/normalizer-registry.service';

const DEFAULT_TIMEOUT = Number(process.env.FETCH_TIMEOUT_MS ?? 8000);
const MAX_ATTEMPTS = Number(process.env.RETRY_MAX_ATTEMPTS ?? 3);
const BASE_DELAY_MS = Number(process.env.RETRY_BASE_DELAY_MS ?? 500);
const FAILURE_THRESHOLD = Number(process.env.CIRCUIT_BREAKER_FAILURES ?? 5);

@Injectable()
export class ProviderFetcherService {
  private readonly logger = new Logger(ProviderFetcherService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly normalizerRegistry: NormalizerRegistry,
  ) {}

  // Public entry used by AggregationService
  async fetchProviderData(provider: Provider) {
    const url = `${provider.baseUrl}/products`;
    // Skip immediate fetch if provider is unhealthy beyond threshold (fast-path)
    if (
      !provider.isHealthy &&
      (provider.consecutiveFailures ?? 0) >= FAILURE_THRESHOLD
    ) {
      this.logger.warn(
        `Skipping ${provider.name} (unhealthy, failures=${provider.consecutiveFailures}).`,
      );
      return { provider, data: [], error: true };
    }

    try {
      const data = await this.fetchWithRetries(provider, url);
      if (data === null) {
        // permanent failure
        await this.markFailure(provider);
        return { provider, data: [], error: true };
      }

      // Success: reset health
      await this.markSuccess(provider);
      return { provider, data, error: false };
    } catch (err: any) {
      this.logger.error(
        `Unexpected fetch error for ${provider.name}: ${err?.message}`,
      );
      await this.markFailure(provider);
      return { provider, data: [], error: true };
    }
  }

  // Fetch all concurrently
  async fetchAll(providers: Provider[]) {
    const promises = providers.map((p) => this.fetchProviderData(p));
    return Promise.all(promises);
  }

  // Core fetch with retries/backoff
  private async fetchWithRetries(
    provider: Provider,
    url: string,
  ): Promise<any[] | null> {
    let attempt = 0;
    while (attempt < MAX_ATTEMPTS) {
      attempt++;
      try {
        const resp: AxiosResponse = await axios.get(url, {
          timeout: DEFAULT_TIMEOUT,
        });
        const normalized = this.normalizerRegistry.normalize(
          provider.name,
          resp.data,
        );

        if (!Array.isArray(normalized)) {
          this.logger.warn(
            `Provider ${provider.name}: normalization did not produce array (attempt ${attempt}).`,
          );
          throw new Error('Normalization produced non-array');
        }

        this.logger.log(
          `Fetched ${normalized.length} items from ${provider.name} (attempt ${attempt}).`,
        );
        return normalized;
      } catch (err: any) {
        const isLast = attempt >= MAX_ATTEMPTS;
        this.logger.warn(
          `Fetch attempt ${attempt} failed for ${provider.name}: ${err?.message}${isLast ? ' (final)' : ''}`,
        );

        if (isLast) break;

        const backoff = this.getBackoffDelay(attempt);
        this.logger.debug(
          `Backing off ${backoff}ms before next attempt for ${provider.name}`,
        );
        await sleep(backoff);
      }
    }

    // Try fallbackUrl once if configured and primary failed
    if (provider.fallbackUrl) {
      try {
        this.logger.log(
          `Trying fallback URL for ${provider.name}: ${provider.fallbackUrl}`,
        );
        const resp: AxiosResponse = await axios.get(
          `${provider.fallbackUrl}/products`,
          { timeout: DEFAULT_TIMEOUT },
        );
        const normalized = this.normalizerRegistry.normalize(
          provider.name,
          resp.data,
        );
        if (Array.isArray(normalized)) {
          this.logger.log(
            `Fallback fetch succeeded for ${provider.name} (${normalized.length} items).`,
          );
          return normalized;
        } else {
          this.logger.warn(
            `Fallback normalization failed for ${provider.name}.`,
          );
        }
      } catch (err: any) {
        this.logger.warn(
          `Fallback request failed for ${provider.name}: ${err?.message}`,
        );
      }
    }

    return null;
  }

  private getBackoffDelay(attempt: number) {
    const exp = Math.pow(2, attempt - 1) * BASE_DELAY_MS;
    const jitter =
      Math.floor(Math.random() * (exp * 0.4)) - Math.floor(exp * 0.2);
    return Math.max(100, exp + jitter);
  }

  // Update provider health on failure (increment)
  private async markFailure(provider: Provider) {
    try {
      const updated = await this.prisma.provider.update({
        where: { id: provider.id },
        data: {
          consecutiveFailures: { increment: 1 },
          isHealthy:
            (provider.consecutiveFailures ?? 0) + 1 < FAILURE_THRESHOLD,
        },
      });
      this.logger.warn(
        `Provider ${provider.name} consecutiveFailures -> ${updated.consecutiveFailures}`,
      );
    } catch (err: any) {
      this.logger.error(
        `Failed to update provider failure state for ${provider.name}: ${err?.message}`,
      );
    }
  }

  // Mark provider healthy on success (reset counters)
  private async markSuccess(provider: Provider) {
    try {
      await this.prisma.provider.update({
        where: { id: provider.id },
        data: {
          consecutiveFailures: 0,
          isHealthy: true,
          lastSuccessfulFetch: new Date(),
        },
      });
    } catch (err: any) {
      this.logger.error(
        `Failed to update provider success state for ${provider.name}: ${err?.message}`,
      );
    }
  }

  // Normalize raw provider responses into a uniform array
  // (Adapts to your mock shapes: A -> array, B -> { products: [...] }, C -> { items: [...] })
  // private normalizeByProviderName(provider: Provider, raw: any): any[] {
  //   if (!raw) return [];

  //   const name = (provider.name ?? '').toLowerCase();

  //   // -------- Provider A --------
  //   if (name.startsWith('provider a')) {
  //     return (Array.isArray(raw) ? raw : []).map((item: any) => ({
  //       providerProductId: item.id,
  //       name: item.name,
  //       description: item.description,
  //       price: item.price,
  //       currency: item.currency,
  //       availability: item.availability,
  //       lastUpdated: new Date(item.lastUpdated),
  //     }));
  //   }

  //   // -------- Provider B --------
  //   if (name.startsWith('provider b')) {
  //     const list = Array.isArray(raw.products) ? raw.products : [];
  //     return list.map((item: any) => ({
  //       providerProductId: item.product_id,
  //       name: item.title,
  //       description: null,
  //       price: item.cost,
  //       currency: item.curr,
  //       availability: item.in_stock === 1,
  //       lastUpdated: new Date(item.updated_at * 1000),
  //     }));
  //   }

  //   // -------- Provider C --------
  //   if (name.startsWith('provider c')) {
  //     const list = Array.isArray(raw.items) ? raw.items : [];
  //     return list.map((item: any) => ({
  //       providerProductId: item.pid,
  //       name: item.meta?.title,
  //       description: item.meta?.desc ?? null,
  //       price: parseFloat(item.pricing?.amount ?? '0'),
  //       currency: item.currency ?? 'USD',
  //       availability: item.available === 1,
  //       lastUpdated: item.ts ? new Date(item.ts) : new Date(),
  //     }));
  //   }
  //   return [];
  // }
}
