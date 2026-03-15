import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AuthService } from '../../auth/auth.service';
import { ThemeMode, ThemeService } from '../../theme/theme.service';

// Importações do PrimeNG
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, Box, Server, Sun, Moon, Monitor, Check } from 'lucide-angular';
import { PopoverModule } from 'primeng/popover';
import { SheetComponent } from '../../components/sheet/sheet.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, PopoverModule, SheetComponent, UserMenuComponent, ButtonModule, TranslocoPipe, LucideAngularModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  translocoService = inject(TranslocoService);
  currentLang = signal<'pt-BR' | 'en'>('en');

  constructor() {
    // 1. Lê do localStorage ou usa o inglês como padrão
    const savedLang = localStorage.getItem('queueharbor-lang') as 'pt-BR' | 'en' || 'en';
    
    // 2. Define o Signal e avisa o Transloco qual usar
    this.currentLang.set(savedLang);
    this.translocoService.setActiveLang(savedLang);
  }

  user = this.authService.currentUser;

  userInitial = computed(() => {
    const email = this.user()?.email;
    return email ? email.charAt(0).toUpperCase() : 'U';
  });

  // Nome do usuário formatado (antes do @)
  userName = computed(() => {
    const email = this.user()?.email;
    return email ? email.split('@')[0] : 'Usuário';
  });

  // Controles dos Modais
  isThemeDialogOpen = signal(false);
  isLangDialogOpen = signal(false);

  // Funções de ação
  openThemeDialog() { this.isThemeDialogOpen.set(true); }
  openLangDialog() { this.isLangDialogOpen.set(true); }

  changeTheme(mode: ThemeMode) {
    this.themeService.setTheme(mode);
    this.isThemeDialogOpen.set(false);
  }

  changeLang(lang: 'pt-BR' | 'en') {
    this.currentLang.set(lang);
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('queueharbor-lang', lang);
    this.isLangDialogOpen.set(false);
  }

  onLogout() {
    this.authService.logout();
  }
}