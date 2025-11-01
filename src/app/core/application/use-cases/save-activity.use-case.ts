import { Injectable, inject } from '@angular/core';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityRepository } from '../../domain/repositories/activity.repository';

/**
 * Use Case: Criar ou atualizar uma atividade
 *
 * Encapsula a lógica de negócio para salvar atividades.
 */
@Injectable({
  providedIn: 'root'
})
export class SaveActivityUseCase {
  private repository = inject(ActivityRepository);

  async execute(params: {
    id?: number;
    date: string;
    title: string;
    description: string;
  }): Promise<Activity> {
    let activity: Activity;

    if (params.id) {
      // Atualizar atividade existente
      const existing = await this.repository.findById(params.id);

      if (!existing) {
        throw new Error('Atividade não encontrada');
      }

      activity = existing.update({
        date: params.date,
        title: params.title,
        description: params.description
      });
    } else {
      // Criar nova atividade
      activity = Activity.create({
        date: params.date,
        title: params.title,
        description: params.description
      });
    }

    return await this.repository.save(activity);
  }
}
