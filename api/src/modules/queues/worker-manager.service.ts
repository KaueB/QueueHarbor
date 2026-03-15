import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from 'bullmq';
import { Repository } from 'typeorm';
import { RedisInstance } from '../redis-instances/entities/redis-instance.entity';
import { ConnectionManagerService } from './connection-manager.service';

@Injectable()
export class WorkerManagerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkerManagerService.name);
  private activeWorkers = new Map<string, Worker>();

  constructor(
    @InjectRepository(RedisInstance)
    private readonly redisRepo: Repository<RedisInstance>,
    private readonly connectionManager: ConnectionManagerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Booting Worker Manager: Initializing existing tenant workers...');
    const tenants = await this.redisRepo.find();
    
    for (const tenant of tenants) {
      await this.startWorker(tenant.name, 'webhooks');
    }
  }

  @OnEvent('redis-instance.created')
  async handleNewInstanceCreated(payload: RedisInstance) {
    this.logger.log(`[Observer] Nova instância detectada no banco! Subindo worker dinâmico para o locatário ${payload.name}...`);
    // O evento de criação passa todos os parâmetros do tenant. Aproveitamos pra iniciar o job dele
    await this.startWorker(payload.name, 'webhooks');
  }

  @OnEvent('redis-instance.removed')
  async handleInstanceRemoved(payload: RedisInstance) {
    this.logger.log(`[Observer] Deleção de instância detectada! Encerrando worker dinâmico para o locatário ${payload.name}...`);
    // Se a instância for apagada, precisamos fechar a conexão do Worker e limpar a memória
    await this.stopWorker(payload.name, 'webhooks');
  }

  async startWorker(tenantId: string, queueName: string) {
    const workerKey = `${tenantId}:${queueName}`;

    if (this.activeWorkers.has(workerKey)) {
      this.logger.debug(`[${tenantId}] Worker for queue '${queueName}' is already running.`);
      return;
    }

    try {
      const config = await this.redisRepo.findOne({ where: { name: tenantId } });
      if (!config) {
        this.logger.error(`[${tenantId}] Tenant configuration not found. Cannot start worker.`);
        return;
      }

      // We ensure the connection is created inside connection manager to maintain a single source of truth
      const connectionInfo = this.connectionManager.getRedisConnection(tenantId, config);

      this.logger.log(`[${tenantId}] Instantiating isolated Worker for queue '${queueName}'`);
      
      const worker = new Worker(
        queueName,
        async (job) => {
          this.logger.debug(`[${tenantId}][${queueName}] Processing job: ${job.id}`);
          this.logger.verbose(`Payload received: ${JSON.stringify(job.data)}`);
          
          // Simulating the logical processing time
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          this.logger.debug(`[${tenantId}][${queueName}] Job successfully processed: ${job.id}`);
          return { success: true, processedAt: new Date().toISOString() };
        },
        { connection: connectionInfo as any }
      );

      worker.on('failed', (job, err) => {
        this.logger.error(`[${tenantId}][${queueName}] Job ${job?.id} failed: ${err.message}`);
      });

      this.activeWorkers.set(workerKey, worker);
    } catch (error: any) {
      this.logger.error(`[${tenantId}] Failed to start worker: ${error.message}`);
    }
  }

  async stopWorker(tenantId: string, queueName: string) {
    const workerKey = `${tenantId}:${queueName}`;
    const worker = this.activeWorkers.get(workerKey);

    if (worker) {
      this.logger.log(`[${tenantId}] Stopping worker for queue '${queueName}'`);
      await worker.close();
      this.activeWorkers.delete(workerKey);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down all active workers...');
    for (const [workerKey, worker] of this.activeWorkers) {
      await worker.close();
      this.logger.debug(`Worker ${workerKey} closed.`);
    }
  }
}
