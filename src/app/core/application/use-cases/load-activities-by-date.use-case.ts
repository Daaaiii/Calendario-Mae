import { Injectable, inject } from '@angular/core';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityRepository } from '../../domain/repositories/activity.repository';

/**
 * Use Case: Carregar atividades por data
 */
@Injectable({
  providedIn: 'root'
})
export class LoadActivitiesByDateUseCase {
  private repository = inject(ActivityRepository);

  async execute(date: string): Promise<Activity[]> {
    return await this.repository.findByDate(date);
  }
}
