import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisInstance } from './entities/redis-instance.entity';
import { RedisInstancesController } from './redis-instances.controller';
import { RedisInstancesService } from './redis-instances.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RedisInstance]),
  ],
  controllers: [RedisInstancesController],
  providers: [RedisInstancesService],
})
export class RedisInstancesModule {}