import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap, finalize, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:3000/auth';

  currentUser = signal<{ id: string; email: string; role: string } | null>(null);

  private refreshRequest$: Observable<any> | null = null;

  constructor() {
    this.loadUserFromToken();
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ access_token: string; refresh_token: string; user: any }>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('tenantmq_token', response.access_token);
          localStorage.setItem('tenantmq_refresh_token', response.refresh_token);
          this.currentUser.set(response.user);
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  logout() {
    localStorage.removeItem('tenantmq_token');
    localStorage.removeItem('tenantmq_refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('tenantmq_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('tenantmq_refresh_token');
  }

  refreshToken(): Observable<any> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    this.refreshRequest$ = this.http
      .post<{ access_token: string; refresh_token: string }>(`${this.API_URL}/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('tenantmq_token', response.access_token);
          localStorage.setItem('tenantmq_refresh_token', response.refresh_token);
        }),
        shareReplay(1),
        finalize(() => (this.refreshRequest$ = null)),
      );

    return this.refreshRequest$;
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!token && !refreshToken) return false;

    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired && !refreshToken) {
          this.logout();
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  private loadUserFromToken() {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if ((token || refreshToken) && this.isLoggedIn()) {
      try {
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired && refreshToken) {
            this.refreshToken().subscribe({
              next: () => this.loadUserFromToken(),
              error: () => this.logout(),
            });
            return;
          }

          this.currentUser.set({
            id: payload.sub,
            email: payload.email,
            role: payload.role,
          });
        } else if (refreshToken) {
          this.refreshToken().subscribe({
            next: () => this.loadUserFromToken(),
            error: () => this.logout(),
          });
        }
      } catch (e) {
        console.error('Erro ao decodificar token:', e);
        this.logout();
      }
    } else if (token || refreshToken) {
      this.logout();
    }
  }
}
