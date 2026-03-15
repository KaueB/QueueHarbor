import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 border-r border-slate-200 bg-white h-full flex flex-col pt-4 overflow-y-auto">
      <nav class="flex-1 px-4 space-y-1">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-slate-100 text-slate-900"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <i class="pi pi-home"></i>
          Dashboard
        </a>
        
        <div class="pt-4 pb-2">
          <span class="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Monitoramento
          </span>
        </div>

        <a
          routerLink="/queues"
          routerLinkActive="bg-slate-100 text-slate-900"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <i class="pi pi-list"></i>
          Filas
        </a>

        <a
          routerLink="/workers"
          routerLinkActive="bg-slate-100 text-slate-900"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <i class="pi pi-cog"></i>
          Workers
        </a>
      </nav>

      <div class="p-4 border-t border-slate-100 mt-auto">
        <div class="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-500">
          <p class="font-semibold mb-1">QueueHarbor v0.1.0</p>
          <p>Potencializado por BullMQ & NestJS</p>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {}
