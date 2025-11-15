import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@prisma-module/prisma.service';
import axios from 'axios';

const RESET_INTERVAL_SECONDS = Number(
  process.env.CIRCUIT_BREAKER_RESET_SECONDS ?? 60,
);
const PROBE_TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS ?? 3000);

@Injectable()
export class HealthProbeService {
  private readonly logger = new Logger(HealthProbeService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run every RESET_INTERVAL_SECONDS seconds
  @Cron(`*/${RESET_INTERVAL_SECONDS} * * * * *`)
  async probeUnhealthyProviders() {
    const unhealthy = await this.prisma.provider.findMany({
      where: { isHealthy: false },
    });

    if (unhealthy.length === 0) return;

    this.logger.log(`Probing ${unhealthy.length} unhealthy providers...`);

    for (const p of unhealthy) {
      const endpoints = [p.baseUrl, p.fallbackUrl].filter(Boolean) as string[];
      let revived = false;
      for (const ep of endpoints) {
        try {
          const url = `${ep}/products`;
          const resp = await axios.get(url, { timeout: PROBE_TIMEOUT_MS });
          // minimal sanity: expect something (array or object)
          if (resp && resp.data) {
            // mark healthy
            await this.prisma.provider.update({
              where: { id: p.id },
              data: {
                consecutiveFailures: 0,
                isHealthy: true,
                lastSuccessfulFetch: new Date(),
              },
            });
            this.logger.log(`Provider ${p.name} revived via ${ep}`);
            revived = true;
            break;
          }
        } catch (err: any) {
          this.logger.debug(
            `Probe failed for ${p.name} via ${ep}: ${err?.message}`,
          );
        }
      }
      if (!revived) {
        this.logger.log(`Provider ${p.name} still unhealthy.`);
      }
    }
  }
}
