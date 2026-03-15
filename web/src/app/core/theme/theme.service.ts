import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    const storedTheme = localStorage.getItem('queueharbor-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      this.isDarkMode.set(true);
    }

    // O effect roda automaticamente sempre que o isDarkMode() mudar
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('queueharbor-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('queueharbor-theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(current => !current);
  }
}