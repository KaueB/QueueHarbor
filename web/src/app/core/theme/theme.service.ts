import { effect, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const VALID_THEMES: ThemeMode[] = ['light', 'dark', 'system'];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<ThemeMode>('system');
  isDarkActive = signal<boolean>(false);

  constructor() {
    const storedTheme = localStorage.getItem('queueharbor-theme') as ThemeMode;
    if (storedTheme) {
      if (VALID_THEMES.includes(storedTheme)) {
        this.theme.set(storedTheme);
      }
    }

    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem('queueharbor-theme', currentTheme);
      this.applyTheme(currentTheme);
    });

    // Escuta mudanças no sistema operacional em tempo real
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.applyTheme('system');
      }
    });
  }

  setTheme(newTheme: ThemeMode) {
    this.theme.set(newTheme);
  }

  private applyTheme(themeMode: ThemeMode) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);
    
    this.isDarkActive.set(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}