import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center p-10 text-center rounded-xl border border-dashed border-border bg-card/30 transition-colors hover:bg-card/50">
      <div class="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center mb-5 text-muted-foreground shadow-sm">
        <lucide-icon [name]="icon || 'inbox'" class="w-7 h-7"></lucide-icon>
      </div>
      <h3 class="text-lg font-semibold tracking-tight text-foreground mb-1.5">{{ title }}</h3>
      <p class="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">{{ description }}</p>
      
      <div class="mt-6 w-full flex justify-center" *ngIf="hasAction">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input({required: true}) title = '';
  @Input({required: true}) description = '';
  @Input() icon = 'inbox';
  @Input() hasAction = false;
}
