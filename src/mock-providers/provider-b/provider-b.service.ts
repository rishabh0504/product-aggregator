import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

type BProduct = {
  product_id: string;
  title: string;
  cost: number;
  curr: string;
  in_stock: number; // 1 or 0
  updated_at: number; // unix seconds
};

@Injectable()
export class ProviderBService implements OnModuleInit, OnModuleDestroy {
  private items: BProduct[] = [];
  private timer: NodeJS.Timeout;

  onModuleInit() {
    const now = Math.floor(Date.now() / 1000);

    this.items = [
      {
        product_id: 'b-100',
        title: 'License: Pro Analytics',
        cost: 129.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-101',
        title: 'Template Pack',
        cost: 9.99,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-102',
        title: 'Design System Kit',
        cost: 49.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-103',
        title: 'UI Icon Set – 2000 Icons',
        cost: 29.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-104',
        title: 'Plugin: Automation Booster',
        cost: 19.99,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-105',
        title: 'Plugin: SEO Enhancer',
        cost: 14.5,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-106',
        title: 'Course: JavaScript Mastery',
        cost: 79.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-107',
        title: 'Course: Fullstack Engineer Path',
        cost: 199.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-108',
        title: 'SaaS: TaskFlow Pro (1 Year License)',
        cost: 299.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-109',
        title: 'SaaS: Team Collaboration (Monthly)',
        cost: 14.99,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-110',
        title: 'Bundle: UI Kit + Templates Mega Pack',
        cost: 89.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
      {
        product_id: 'b-111',
        title: 'Asset Pack: 3D Illustrations Set',
        cost: 39.0,
        curr: 'USD',
        in_stock: 1,
        updated_at: now,
      },
    ];

    this.timer = setInterval(() => this.mutate(), 7000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  getProducts() {
    return { products: this.items.map((i) => ({ ...i })) };
  }

  private mutate() {
    this.items = this.items.map((i) => {
      const delta = (Math.random() * 0.2 - 0.1) * i.cost;
      const newCost = Number((i.cost + delta).toFixed(2));
      const inStock = Math.random() > 0.15 ? 1 : 0;

      return {
        ...i,
        cost: newCost,
        in_stock: inStock,
        updated_at: Math.floor(Date.now() / 1000),
      };
    });
  }
}
