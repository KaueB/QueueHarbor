import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { StatCardComponent } from '../../core/components/stat-card/stat-card.component';
import { QueueService } from '../../core/services/queue.service';
import { QueueInfo, QueueTableComponent } from './components/queue-table/queue-table.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent, QueueTableComponent, LucideAngularModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private queueService = inject(QueueService);

  mockQueues = signal<QueueInfo[]>([]);
  stats = signal<any>({
    totalJobs: '0',
    activeNow: '0',
    completed24h: '0',
    errorSystems: '0'
  });

  constructor() {
    this.loadData();
  }

  loadData() {
    this.queueService.getMetrics().subscribe(data => this.mockQueues.set(data));
    this.queueService.getStats().subscribe(data => this.stats.set(data));
  }
}
