import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

type CItem = {
  pid: string;
  meta: { title: string; desc?: string };
  pricing: { amount: string }; // weird provider sends price as string
  currency?: string;
  available: 0 | 1;
  ts: string; // ISO timestamp
};

@Injectable()
export class ProviderCService implements OnModuleInit, OnModuleDestroy {
  private items: CItem[] = [];
  private timer: NodeJS.Timeout;

  onModuleInit() {
    this.items = [
      {
        pid: 'c-x1',
        meta: {
          title: 'Masterclass: System Design',
          desc: 'Architecture course',
        },
        pricing: { amount: '199.00' },
        currency: 'USD',
        available: 1,
        ts: new Date().toISOString(),
      },
      {
        pid: 'c-x2',
        meta: { title: 'Plugin: SEO Booster' },
        pricing: { amount: '29.99' },
        currency: 'USD',
        available: 1,
        ts: new Date().toISOString(),
      },
      {
        pid: 'c-x3',
        meta: {
          title: 'UI Template: Dashboard Pro',
          desc: 'Premium admin dashboard templates',
        },
        pricing: { amount: '49.50' },
        currency: 'USD',
        available: 1,
        ts: new Date().toISOString(),
      },
      {
        pid: 'c-x4',
        meta: {
          title: 'AI Content Writer',
          desc: 'Tool for generating optimized content',
        },
        pricing: { amount: '15.00' },
        currency: 'USD',
        available: 1,
        ts: new Date().toISOString(),
      },
      {
        pid: 'c-x5',
        meta: {
          title: 'Code Snippets Mega Pack',
        },
        pricing: { amount: '9.99' },
        currency: 'USD',
        available: 1,
        ts: new Date().toISOString(),
      },
      {
        pid: 'c-x6',
        meta: {
          title: 'Workshop: Kubernetes in Production',
          desc: 'Live hands-on workshop',
        },
        pricing: { amount: '149.00' },
        currency: 'USD',
        available: 1,
        ts: new Date().toISOString(),
      },
    ];

    this.timer = setInterval(() => this.mutate(), 6000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  getProducts() {
    return { items: this.items.map((i) => ({ ...i })) };
  }

  private mutate() {
    this.items = this.items.map((i) => {
      const amountNum = parseFloat(i.pricing.amount);
      const delta = (Math.random() * 0.2 - 0.1) * amountNum; // ±10%
      const newAmount = Number((amountNum + delta).toFixed(2)).toString();

      const available = Math.random() > 0.12 ? 1 : 0; // 12% chance unavailable

      return {
        ...i,
        pricing: { amount: newAmount },
        available,
        ts: new Date().toISOString(),
      };
    });
  }
}
