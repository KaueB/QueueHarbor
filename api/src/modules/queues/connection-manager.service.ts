import { Injectable, Logger, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { RedisInstance } from '../redis-instances/entities/redis-instance.entity';

@Injectable()
export class ConnectionManagerService implements OnModuleDestroy {
  private readonly logger = new Logger(ConnectionManagerService.name);
  private queues = new Map<string, Queue>();
  private connections = new Map<string, Redis>();

  constructor(
    @InjectRepository(RedisInstance)
    private redisRepo: Repository<RedisInstance>,
  ) {}

  async getQueue(tenantId: string, queueName: string): Promise<Queue> {
    const cacheKey = `${tenantId}:${queueName}`;

    if (this.queues.has(cacheKey)) {
      return this.queues.get(cacheKey)!;
    }

    const config = await this.redisRepo.findOne({ where: { name: tenantId } });

    if (!config) {
      throw new NotFoundException(`Instância Redis para o tenant '${tenantId}' não cadastrada ou não encontrada.`);
    }

    if (!this.connections.has(tenantId)) {
      const redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password || undefined,
        maxRetriesPerRequest: null, // Obrigatório para o BullMQ funcionar
      });
      this.connections.set(tenantId, redis);
    }

    const connectionInfo = this.connections.get(tenantId) as any;

    const queue = new Queue(queueName, { 
      connection: connectionInfo
    });

    this.queues.set(cacheKey, queue);
    return queue;
  }

  getRedisConnection(tenantId: string, config: RedisInstance): Redis {
    if (!this.connections.has(tenantId)) {
      const redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password || undefined,
        maxRetriesPerRequest: null,
      });
      this.connections.set(tenantId, redis);
    }
    return this.connections.get(tenantId)!;
  }

  async getMetrics() {
    return [
      { name: 'email-notifications', status: 'active', activeJobs: 12, completedJobs: 1450, failedJobs: 5, delayedJobs: 2 },
      { name: 'image-processing', status: 'active', activeJobs: 4, completedJobs: 820, failedJobs: 12, delayedJobs: 0 },
      { name: 'report-generator', status: 'paused', activeJobs: 0, completedJobs: 310, failedJobs: 1, delayedJobs: 5 },
      { name: 'data-backup', status: 'waiting', activeJobs: 0, completedJobs: 45, failedJobs: 0, delayedJobs: 0 },
    ];
  }

  async getStats() {
    return {
      totalJobs: '2,450',
      activeNow: '16',
      completed24h: '1,280',
      errorSystems: '2'
    };
  }

  async onModuleDestroy() {
    for (const queue of this.queues.values()) await queue.close();
    for (const conn of this.connections.values()) conn.disconnect();
  }
}
