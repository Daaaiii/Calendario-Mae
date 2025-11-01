import { inject } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/entities/user.entity';

/**
 * Use Case: Obter usuário atual
 *
 * Responsabilidade: Recuperar informações do usuário autenticado
 */
export class GetCurrentUserUseCase {
  private authRepository = inject(AuthRepository);

  /**
   * Executa a obtenção do usuário atual
   * @returns Usuário autenticado ou null
   */
  async execute(): Promise<User | null> {
    return await this.authRepository.getCurrentUser();
  }
}
