import { BadRequestException, Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConnectionManagerService } from './connection-manager.service';

@Controller('queues')
export class QueuesController {
  constructor(private readonly connectionManager: ConnectionManagerService) {}

  @Post('enqueue')
  async dispatch(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    if (!tenantId) {
      throw new BadRequestException('Header x-tenant-id é obrigatório para roteamento do payload.');
    }

    const queue = await this.connectionManager.getQueue(tenantId, 'webhooks');
    
    const job = await queue.add('process-request', body);
    
    return { id: job.id, status: 'dispatched' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('metrics')
  async getMetrics() {
    return this.connectionManager.getMetrics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.connectionManager.getStats();
  }
}
