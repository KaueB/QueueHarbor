import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:3000/auth';

  // Signal reativo para o estado de autenticação
  currentUser = signal<{ id: string; email: string; role: string } | null>(null);

  constructor() {
    this.loadUserFromToken();
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ access_token: string; user: any }>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('tenantmq_token', response.access_token);
          this.currentUser.set(response.user);
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  logout() {
    localStorage.removeItem('tenantmq_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('tenantmq_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      // !TODO: Decodificar o JWT e setar o usuário
      this.currentUser.set({ id: '1', email: 'admin@local', role: 'SUPER_ADMIN' });
    }
  }
}
