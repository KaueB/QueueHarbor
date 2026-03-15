import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateRedisInstanceDto } from './dto/create-redis-instance.dto';
import { RedisInstancesService } from './redis-instances.service';

@Controller('redis-instances')
export class RedisInstancesController {
  constructor(
    private readonly redisInstancesService: RedisInstancesService,
  ) {}

  @Post()
  async create(@Body() createRedisInstanceDto: CreateRedisInstanceDto) {
    return this.redisInstancesService.create(createRedisInstanceDto);
  }

  @Get()
  findAll() {
    return this.redisInstancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.redisInstancesService.findOneOrFail(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Para simplificar: na prática teríamos que buscar qual o 'name' (slug) do tenant
    // antes de deletar, para poder parar o worker com stopWorker(slug, 'webhooks')
    return this.redisInstancesService.remove(id);
  }
}