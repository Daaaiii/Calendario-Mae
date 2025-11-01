import { Injectable, inject } from '@angular/core';
import { ActivityRepository } from '../../domain/repositories/activity.repository';

/**
 * Use Case: Excluir uma atividade
 */
@Injectable({
  providedIn: 'root'
})
export class DeleteActivityUseCase {
  private repository = inject(ActivityRepository);

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('ID inválido');
    }

    const activity = await this.repository.findById(id);

    if (!activity) {
      throw new Error('Atividade não encontrada');
    }

    await this.repository.delete(id);
  }
}
