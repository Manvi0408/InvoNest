import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import * as QueueMQ from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { ForecastingService } from '../forecasting/forecasting.service';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private queue: Queue;
  private worker: Worker;
  private useFallback = true;

  constructor(
    private readonly prisma: PrismaService,
    private readonly riskEngine: RiskEngineService,
    private readonly forecasting: ForecastingService,
  ) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      try {
        this.logger.log(`Attempting to initialize BullMQ with Redis at ${redisUrl}...`);
        this.queue = new Queue('invonest-jobs', {
          connection: { url: redisUrl },
        });

        this.worker = new Worker(
          'invonest-jobs',
          async (job: Job) => {
            await this.processJob(job.name, job.data);
          },
          { connection: { url: redisUrl } },
        );

        this.worker.on('completed', (job) => {
          this.logger.log(`Job ${job.id} of type ${job.name} finished successfully.`);
        });

        this.worker.on('failed', (job, err) => {
          this.logger.error(`Job ${job?.id} of type ${job?.name} failed: ${err.message}`);
        });

        this.useFallback = false;
        this.logger.log('BullMQ queues and workers running.');

        // Schedule recurring jobs (Every night/hour)
        await this.queue.add('risk-recalculation', {}, { repeat: { pattern: '0 2 * * *' } });
        await this.queue.add('forecast-generator', {}, { repeat: { pattern: '0 3 * * *' } });
      } catch (err) {
        this.logger.warn(`Failed to connect to Redis. Falling back to background polling: ${err.message}`);
      }
    }

    if (this.useFallback) {
      this.logger.log('Fallback Scheduler activated. Initiating polling tickers for background tasks...');
      this.runFallbackTickers();
    }
  }

  private runFallbackTickers() {
    // Recalculate risks and forecasts every 10 minutes locally for demo purposes
    setInterval(async () => {
      this.logger.log('[Fallback Queue Worker] Starting scheduled background tasks...');
      try {
        await this.processJob('risk-recalculation', {});
        await this.processJob('forecast-generator', {});
      } catch (err) {
        this.logger.error(`Fallback scheduler failed: ${err.message}`);
      }
    }, 10 * 60 * 1000);
  }

  async addJob(name: string, data: any) {
    if (!this.useFallback && this.queue) {
      await this.queue.add(name, data);
    } else {
      this.logger.log(`[Fallback Queue Worker] Enqueued direct task: ${name}`);
      // Asynchronously process task immediately in fallback mode
      setTimeout(() => this.processJob(name, data).catch((e) => this.logger.error(e)), 100);
    }
  }

  private async processJob(name: string, data: any) {
    this.logger.log(`Processing job: ${name}`);
    switch (name) {
      case 'risk-recalculation':
        // Scan all clients and re-assess risk profile indices
        const clients = await this.prisma.client.findMany({ select: { id: true } });
        for (const client of clients) {
          await this.riskEngine.calculateClientHealthScore(client.id);
        }
        this.logger.log(`Completed risk-recalculations for ${clients.length} clients.`);
        break;

      case 'forecast-generator':
        // Generate new cash flow forecasts for active organizations
        const orgs = await this.prisma.organization.findMany({ select: { id: true } });
        for (const org of orgs) {
          await this.forecasting.getForecast(org.id, 30);
        }
        this.logger.log(`Generated active forecast snapshots for ${orgs.length} orgs.`);
        break;

      case 'reminder-scheduler':
        // Check for reminders due today and run them
        const today = new Date();
        const dueReminders = await this.prisma.reminder.findMany({
          where: {
            status: 'SCHEDULED',
            scheduledFor: { lte: today },
          },
        });
        
        this.logger.log(`Discovered ${dueReminders.length} reminders ready for execution.`);
        // Note: Execution triggers could be mapped through the Automation Service
        break;

      default:
        this.logger.warn(`Job handler for ${name} is not registered.`);
    }
  }
}
