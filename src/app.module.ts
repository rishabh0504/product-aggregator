import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { MockProvidersModule } from './mock-providers/mock-providers.module';
import { AggregationModule } from './aggregation/aggregation.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MockProvidersModule,
    AggregationModule,
    ProductsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
