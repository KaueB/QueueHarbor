import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { StatCardComponent } from '../../core/components/stat-card/stat-card.component';
import { QueueInfo, QueueTableComponent } from './components/queue-table/queue-table.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent, QueueTableComponent, LucideAngularModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  mockQueues: QueueInfo[] = [
    { name: 'email-notifications', status: 'active', activeJobs: 12, completedJobs: 1450, failedJobs: 5, delayedJobs: 2 },
    { name: 'image-processing', status: 'active', activeJobs: 4, completedJobs: 820, failedJobs: 12, delayedJobs: 0 },
    { name: 'report-generator', status: 'paused', activeJobs: 0, completedJobs: 310, failedJobs: 1, delayedJobs: 5 },
    { name: 'data-backup', status: 'waiting', activeJobs: 0, completedJobs: 45, failedJobs: 0, delayedJobs: 0 },
  ];
}


