import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoPipe } from '@ngneat/transloco';

export interface QueueInfo {
  name: string;
  status: 'active' | 'paused' | 'waiting';
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  delayedJobs: number;
}

@Component({
  selector: 'app-queue-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslocoPipe],
  template: `
    <div class="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold tracking-tight text-foreground">Filas BullMQ</h3>
          <p class="text-sm text-muted-foreground">Monitoramento em tempo real do processamento de jobs.</p>
        </div>
        <div class="flex items-center gap-2">
           <button class="inline-flex items-center justify-center rounded-lg border border-input bg-background/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors gap-2">
            <lucide-icon name="server" class="w-3.5 h-3.5"></lucide-icon>
            {{ 'layout.sidebar.queues' | transloco }}
           </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-muted/30">
              <th class="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Fila</th>
              <th class="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border text-center">Ativos</th>
              <th class="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border text-center">Concluídos</th>
              <th class="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border text-center">Falhas</th>
              <th class="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border text-right pr-8">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr *ngFor="let queue of queues" class="hover:bg-muted/20 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                    <lucide-icon name="box" class="w-4 h-4"></lucide-icon>
                  </div>
                  <span class="font-bold text-sm text-foreground">{{ queue.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span [ngClass]="{
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': queue.status === 'active',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': queue.status === 'paused',
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400': queue.status === 'waiting'
                }" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border border-transparent">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="{
                    'bg-green-500': queue.status === 'active',
                    'bg-yellow-500': queue.status === 'paused',
                    'bg-slate-400': queue.status === 'waiting'
                  }"></span>
                  {{ queue.status | uppercase }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-semibold text-foregroundbg-muted/50 px-2 py-0.5 rounded-md">{{ queue.activeJobs }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-semibold text-green-600 dark:text-green-400">{{ queue.completedJobs }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span [class.text-red-500]="queue.failedJobs > 0" class="text-sm font-semibold text-muted-foreground">{{ queue.failedJobs }}</span>
              </td>
              <td class="px-6 py-4 text-right pr-8">
                <div class="flex items-center justify-end gap-2">
                   <button class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <lucide-icon name="palette" class="w-4 h-4"></lucide-icon>
                  </button>
                  <button class="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <lucide-icon name="log-out" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4 bg-muted/10 border-t border-border flex items-center justify-center gap-4">
        <button class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" disabled>Anterior</button>
        <div class="flex gap-1">
          <span class="w-6 h-6 rounded bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shadow-sm shadow-primary/20">1</span>
        </div>
        <button class="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" disabled>Próxima</button>
      </div>
    </div>
  `
})
export class QueueTableComponent {
  @Input() queues: QueueInfo[] = [];
}
