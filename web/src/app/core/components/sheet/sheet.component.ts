import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 z-50 bg-black/80 transition-opacity duration-300"
      [class.opacity-0]="!isOpen"
      [class.opacity-100]="isOpen"
      [class.pointer-events-none]="!isOpen"
      (click)="close()">
    </div>

    <!-- Panel -->
    <div
      class="fixed inset-y-0 right-0 z-50 h-full w-full sm:w-[400px] border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out flex flex-col pt-2"
      [class.translate-x-full]="!isOpen"
      [class.translate-x-0]="isOpen">
      
      <div class="flex items-start justify-between border-border px-6 py-4">
        <div class="flex flex-col gap-1.5 pr-6">
          <h2 class="text-xl font-semibold tracking-tight">{{ title }}</h2>
          <p *ngIf="description" class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
        <button (click)="close()" class="flex h-8 w-8 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0">
          <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
          <span class="sr-only">Close</span>
        </button>
      </div>

      <div class="px-6 pb-6 flex-1 overflow-y-auto">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class SheetComponent {
  readonly X = X;
  @Input({required: true}) isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() title = '';
  @Input() description = '';

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }
}
