import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { TranslocoPipe } from '@ngneat/transloco';
import { LucideAngularModule, Palette, Languages, LogOut, ChevronUp } from 'lucide-angular';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, PopoverModule, TranslocoPipe, LucideAngularModule],
  template: `
    <button (click)="userMenu.toggle($event)" class="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl border border-border/60 bg-background/50 hover:bg-muted/50 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring gap-2 group">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shadow-sm transition-transform group-hover:scale-105">
          {{ userInitial }}
        </div>
        <div class="flex flex-col text-left truncate">
          <span class="text-sm font-medium leading-none truncate text-foreground">{{ userName }}</span>
          <span class="text-xs text-muted-foreground mt-1 truncate">{{ email }}</span>
        </div>
      </div>
      <lucide-icon name="chevron-up" class="w-3.5 h-3.5 text-muted-foreground opacity-40 transition-opacity group-hover:opacity-100"></lucide-icon>
    </button>

    <p-popover #userMenu>
      <div class="flex flex-col space-y-1 p-2">
        <p class="text-sm font-medium leading-none text-foreground font-semibold">{{ userName }}</p>
        <p class="text-xs leading-none text-muted-foreground">{{ email }}</p>
      </div>

      <div class="h-px bg-border my-1 w-[calc(100%+8px)] -ml-1"></div>

      <div class="flex flex-col gap-0.5 mt-1">
        <button (click)="onTheme(); userMenu.hide()" class="flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted font-medium hover:text-foreground text-foreground/80 focus:outline-none cursor-pointer group">
          <lucide-icon name="palette" class="mr-2.5 w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground"></lucide-icon>
          <span>{{ 'layout.settings.theme' | transloco }}</span>
        </button>
        
        <button (click)="onLanguage(); userMenu.hide()" class="flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted font-medium hover:text-foreground text-foreground/80 focus:outline-none cursor-pointer group">
          <lucide-icon name="languages" class="mr-2.5 w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground"></lucide-icon>
          <span>{{ 'layout.settings.language' | transloco }}</span>
        </button>
      </div>

      <div class="h-px bg-border my-1 w-[calc(100%+8px)] -ml-1"></div>

      <button (click)="onLogoutAction(); userMenu.hide()" class="flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-destructive/10 hover:text-destructive text-foreground/80 font-medium focus:outline-none cursor-pointer mt-1 group">
        <lucide-icon name="log-out" class="mr-2.5 w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive"></lucide-icon>
        <span>{{ 'layout.sidebar.logout' | transloco }}</span>
      </button>
    </p-popover>
  `
})
export class UserMenuComponent {
  @Input({required: true}) userInitial = '';
  @Input({required: true}) userName = '';
  @Input({required: true}) email = '';

  @Output() openTheme = new EventEmitter<void>();
  @Output() openLanguage = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onTheme() {
    this.openTheme.emit();
  }

  onLanguage() {
    this.openLanguage.emit();
  }

  onLogoutAction() {
    this.logout.emit();
  }
}
