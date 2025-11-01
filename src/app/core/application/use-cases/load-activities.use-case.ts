import { Injectable, inject } from '@angular/core';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityRepository } from '../../domain/repositories/activity.repository';

/**
 * Use Case: Carregar todas as atividades
 *
 * Segue o princípio de Responsabilidade Única (S do SOLID):
 * Uma única razão para mudar - regras de negócio para carregar atividades.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadActivitiesUseCase {
  private repository = inject(ActivityRepository);

  async execute(): Promise<Activity[]> {
    return await this.repository.findAll();
  }
}
