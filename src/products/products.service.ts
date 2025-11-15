import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@prisma-module/prisma.service';
import { Prisma, Product, PriceHistory } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async listProducts(params: {
    page?: number;
    limit?: number;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: boolean;
    providerId?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (params.name) {
      where.name = { contains: params.name, mode: 'insensitive' };
    }

    if (typeof params.availability === 'boolean') {
      where.availability = params.availability;
    }

    if (params.providerId) {
      where.providerId = params.providerId;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { provider: true },
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit || 1),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        provider: true,
        history: { orderBy: { changedAt: 'desc' } },
      },
    });

    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  /**
   * Return list of products with history entries within last `minutes`.
   * If minutes is 0 or not provided, default to 60.
   */
  async getProductsChanges(minutes = 60) {
    if (minutes <= 0) minutes = 60;
    const threshold = new Date(Date.now() - minutes * 60 * 1000);

    const histories = await this.prisma.priceHistory.findMany({
      where: { changedAt: { gte: threshold } },
      include: {
        product: {
          include: {
            provider: true,
          },
        },
      },
      orderBy: { changedAt: 'desc' },
    });

    // Map to unique products (by productId) but keep the latest change info
    const map = new Map<
      string,
      { product: Product & { provider: any }; latestChange: PriceHistory }
    >();

    for (const h of histories) {
      const pid = h.productId;
      if (!map.has(pid)) {
        map.set(pid, { product: h.product as any, latestChange: h as any });
      } else {
        // already present, skip (we ordered by changedAt desc so first is latest)
      }
    }

    const results = Array.from(map.values()).map((v) => ({
      product: v.product,
      latestChange: v.latestChange,
    }));

    return results;
  }
}
