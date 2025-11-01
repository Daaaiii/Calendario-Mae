import { Injectable, inject } from '@angular/core';
import { ActivityRepository } from '../../domain/repositories/activity.repository';

/**
 * Use Case: Limpar todas as atividades
 */
@Injectable({
  providedIn: 'root'
})
export class ClearAllActivitiesUseCase {
  private repository = inject(ActivityRepository);

  async execute(): Promise<void> {
    await this.repository.deleteAll();
  }
}
