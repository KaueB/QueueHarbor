import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-card border border-border rounded-xl p-6 shadow-sm text-card-foreground transition-all duration-300 hover:shadow-md hover:border-primary/30 relative overflow-hidden group">
      <!-- Decorator -->
      <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110"></div>
      
      <div class="flex items-center justify-between relative z-10">
        <span class="text-sm font-medium text-muted-foreground">{{ title }}</span>
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary" *ngIf="icon">
           <lucide-icon [name]="icon" class="w-4 h-4"></lucide-icon>
        </div>
      </div>
      <p class="text-3xl font-bold mt-4 tracking-tight relative z-10">{{ value }}</p>
    </div>
  `
})
export class StatCardComponent {
  @Input({required: true}) title = '';
  @Input({required: true}) value: string | number = '';
  @Input() icon = '';
}
