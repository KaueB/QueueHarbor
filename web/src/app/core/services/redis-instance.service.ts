import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RedisInstance, CreateRedisInstanceDto } from '../models/redis-instance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RedisInstanceService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/redis-instances`;

  findAll(): Observable<RedisInstance[]> {
    return this.http.get<RedisInstance[]>(this.API_URL);
  }

  findOne(id: string): Observable<RedisInstance> {
    return this.http.get<RedisInstance>(`${this.API_URL}/${id}`);
  }

  create(dto: CreateRedisInstanceDto): Observable<RedisInstance> {
    return this.http.post<RedisInstance>(this.API_URL, dto);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
