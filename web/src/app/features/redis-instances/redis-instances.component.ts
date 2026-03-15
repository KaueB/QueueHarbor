import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { RedisInstance } from '../../core/models/redis-instance.model';
import { RedisInstanceService } from '../../core/services/redis-instance.service';

@Component({
  standalone: true,
  selector: 'app-redis-instances',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './redis-instances.component.html',
})
export class RedisInstancesComponent {
  private fb = inject(FormBuilder);
  private redisInstanceService = inject(RedisInstanceService);

  instances = signal<RedisInstance[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  showForm = signal(false);

  instanceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    host: ['localhost', [Validators.required]],
    port: [6379, [Validators.required, Validators.min(1)]],
    password: [''],
  });

  constructor() {
    this.loadInstances();
  }

  loadInstances() {
    this.isLoading.set(true);
    this.redisInstanceService
      .findAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => this.instances.set(data));
  }

  toggleForm() {
    this.showForm.update((v) => !v);
    if (!this.showForm()) {
      this.instanceForm.reset({ host: 'localhost', port: 6379 });
    }
  }

  onSubmit() {
    if (this.instanceForm.invalid) return;

    this.isSubmitting.set(true);
    const dto = this.instanceForm.getRawValue() as any;

    this.redisInstanceService
      .create(dto)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.loadInstances();
          this.toggleForm();
        },
        error: (err) => {
          console.error('Erro ao criar instância:', err);
        },
      });
  }

  removeInstance(id: string) {
    if (!confirm('Tem certeza que deseja remover esta instância?')) return;

    this.redisInstanceService.remove(id).subscribe(() => {
      this.loadInstances();
    });
  }
}
