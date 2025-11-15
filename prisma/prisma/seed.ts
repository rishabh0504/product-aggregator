// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const providers = [
    {
      name: 'Provider A (Flat)',
      baseUrl: 'http://localhost:3000/mock-providers/provider-a',
    },
    {
      name: 'Provider B (Wrapped)',
      baseUrl: 'http://localhost:3000/mock-providers/provider-b',
    },
    {
      name: 'Provider C (Nested)',
      baseUrl: 'http://localhost:3000/mock-providers/provider-c',
    },
  ];

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { name: p.name },
      update: { baseUrl: p.baseUrl },
      create: p,
    });
  }

  console.log('Seeded providers');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
