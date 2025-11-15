import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

type AProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  availability: boolean;
  lastUpdated: string; // ISO
};

@Injectable()
export class ProviderAService implements OnModuleInit, OnModuleDestroy {
  private products: AProduct[] = [];
  private timer: NodeJS.Timeout;

  onModuleInit() {
    // seed initial data
    this.products = [
      {
        id: 'a-1',
        name: 'E-Book: Learn NestJS',
        description: 'A practical NestJS book',
        price: 19.99,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-2',
        name: 'Course: Advanced TypeScript',
        description: 'In-depth TypeScript skills',
        price: 49.0,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-3',
        name: 'Pro UI Kit',
        description: 'Premium UI components for React',
        price: 29.0,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-4',
        name: 'Template: SaaS Landing Page',
        description: 'Modern landing page template',
        price: 17.5,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-5',
        name: 'API Design Handbook',
        description: 'Guide for designing scalable APIs',
        price: 24.99,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-6',
        name: 'Video Course: System Design Fundamentals',
        description: 'Step-by-step guide to system design',
        price: 59.99,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-7',
        name: 'DevOps Pipeline Templates',
        description: 'CI/CD templates for GitHub Actions',
        price: 14.99,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'a-8',
        name: 'AI Prompt Engineering Guide',
        description: 'Master prompt patterns and techniques',
        price: 34.0,
        currency: 'USD',
        availability: true,
        lastUpdated: new Date().toISOString(),
      },
    ];

    // mutate periodically
    this.timer = setInterval(() => this.mutate(), 5000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  getProducts(): AProduct[] {
    return this.products.map((p) => ({ ...p }));
  }

  private mutate() {
    this.products = this.products.map((p) => {
      const delta = (Math.random() * 0.2 - 0.1) * p.price; // -10%..+10%
      const newPrice = Math.max(0.01, Number((p.price + delta).toFixed(2)));

      const availability = Math.random() > 0.1; // 10% chance to be unavailable

      return {
        ...p,
        price: newPrice,
        availability,
        lastUpdated: new Date().toISOString(),
      };
    });
  }
}
