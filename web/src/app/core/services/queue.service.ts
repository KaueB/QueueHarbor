import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/queues`;

  enqueue(instanceName: string, payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/enqueue`, payload, {
      headers: {
        'x-redis-instance': instanceName,
      },
    });
  }

  getMetrics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/metrics`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/stats`);
  }
}
