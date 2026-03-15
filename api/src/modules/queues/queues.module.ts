import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisInstance } from '../redis-instances/entities/redis-instance.entity';
import { ConnectionManagerService } from './connection-manager.service';
import { QueuesController } from './queues.controller';
import { WorkerManagerService } from './worker-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([RedisInstance])],
  controllers: [QueuesController],
  providers: [ConnectionManagerService, WorkerManagerService],
  exports: [ConnectionManagerService, WorkerManagerService],
})
export class QueuesModule {}
