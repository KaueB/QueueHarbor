import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { QueuesModule } from './modules/queues/queues.module';
import { RedisInstance } from './modules/redis-instances/entities/redis-instance.entity';
import { RedisInstancesModule } from './modules/redis-instances/redis-instances.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'adminpassword',
      database: process.env.DB_NAME || 'quere-harbor-db',
      entities: [User, RedisInstance],
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    QueuesModule,
    RedisInstancesModule, 
  ],
})
export class AppModule {}