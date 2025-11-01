import { inject } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

/**
 * Use Case: Logout do usuário
 *
 * Responsabilidade: Encerrar sessão do usuário
 */
export class LogoutUseCase {
  private authRepository = inject(AuthRepository);

  /**
   * Executa o logout do usuário
   */
  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
