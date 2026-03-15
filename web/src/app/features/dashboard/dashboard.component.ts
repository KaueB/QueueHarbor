import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div class="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
          Dashboard
        </h1>
        <p class="text-sm text-slate-600">
          Bem-vindo ao painel do QueueHarbor. Em breve você verá aqui o resumo das filas, workers e métricas.
        </p>
      </div>
    </div>
  `,
})
export class DashboardComponent {}

