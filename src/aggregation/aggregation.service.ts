import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderFetcherService } from './provider-fetcher.service';

@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fetcher: ProviderFetcherService,
  ) {}

  @Cron(`*/${process.env.FETCH_INTERVAL_SECONDS || 20} * * * * *`)
  async aggregate() {
    this.logger.log('Running aggregation cycle...');

    const providers = await this.prisma.provider.findMany();
    const results = await this.fetcher.fetchAll(providers);

    for (const result of results) {
      if (result.error || !Array.isArray(result.data)) {
        this.logger.warn(
          `Provider ${result.provider?.name} returned invalid data`,
        );
        continue;
      }

      for (const product of result.data) {
        await this.upsertProduct(result.provider.id, product);
      }
    }

    await this.markStaleData();
  }

  async upsertProduct(providerId: string, product: any) {
    // 1️⃣ --- HARD GUARD AGAINST BAD PROVIDER DATA ---
    if (!product?.providerProductId) {
      this.logger.warn(
        `Skipping product for provider ${providerId}: Missing providerProductId`,
      );
      return;
    }

    if (product.price == null || Number.isNaN(product.price)) {
      this.logger.warn(
        `Skipping product ${product.providerProductId}: Invalid price`,
      );
      return;
    }

    // 2️⃣ --- Check existing product for price history ---
    const existing = await this.prisma.product.findFirst({
      where: {
        providerId,
        providerProductId: product.providerProductId,
      },
    });

    if (existing && existing.price !== product.price) {
      await this.prisma.priceHistory.create({
        data: {
          productId: existing.id,
          oldPrice: existing.price,
          newPrice: product.price,
        },
      });
    }

    // 3️⃣ --- Upsert Product ---
    try {
      await this.prisma.product.upsert({
        where: {
          providerId_providerProductId: {
            providerId,
            providerProductId: product.providerProductId,
          },
        },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          availability: product.availability,
          lastUpdated: product.lastUpdated,
          isStale: false,
        },
        create: {
          providerId,
          providerProductId: product.providerProductId,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          availability: product.availability,
          lastUpdated: product.lastUpdated,
        },
      });
    } catch (err: any) {
      this.logger.error(
        `Upsert failed for provider ${providerId}, product ${product.providerProductId}: ${err.message}`,
      );
    }
  }

  async markStaleData() {
    const seconds = Number(process.env.STALENESS_SECONDS || 120);
    const threshold = new Date(Date.now() - seconds * 1000);

    await this.prisma.product.updateMany({
      where: {
        lastUpdated: { lt: threshold },
      },
      data: { isStale: true },
    });
  }
}
