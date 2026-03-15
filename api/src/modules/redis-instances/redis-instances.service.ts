import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRedisInstanceDto } from './dto/create-redis-instance.dto';
import { RedisInstance } from './entities/redis-instance.entity';

@Injectable()
export class RedisInstancesService {
  constructor(
    @InjectRepository(RedisInstance)
    private repository: Repository<RedisInstance>,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createRedisInstanceDto: CreateRedisInstanceDto) {
    const exists = await this.repository.findOne({ where: { name: createRedisInstanceDto.name } });
    if (exists) throw new ConflictException('Já existe uma instância com este nome.');

    const instance = this.repository.create(createRedisInstanceDto);
    const savedInstance = await this.repository.save(instance);
    
    this.eventEmitter.emit('redis-instance.created', savedInstance);
    
    return savedInstance;
  }

  findAll() {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneOrFail(id: string) {
    const instance = await this.repository.findOne({ where: { id } });
    if (!instance) throw new NotFoundException('Instância não encontrada.');
    return instance;
  }

  async remove(id: string) {
    const instance = await this.findOneOrFail(id);
    const deletedInstance = await this.repository.remove(instance);

    this.eventEmitter.emit('redis-instance.removed', deletedInstance);
    
    return deletedInstance;
  }
}