import { Injectable, inject } from '@angular/core';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityRepository } from '../../domain/repositories/activity.repository';

/**
 * Use Case: Buscar atividade por ID
 */
@Injectable({
  providedIn: 'root'
})
export class GetActivityByIdUseCase {
  private repository = inject(ActivityRepository);

  async execute(id: number): Promise<Activity | null> {
    if (id < 0 || id === undefined || id === null) {
      throw new Error('ID inválido');
    }

    return await this.repository.findById(id);
  }
}
