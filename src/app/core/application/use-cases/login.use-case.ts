import { inject } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginCredentials, AuthResult } from '../../domain/entities/user.entity';

/**
 * Use Case: Login do usuário
 *
 * Responsabilidade: Realizar autenticação do usuário no sistema
 */
export class LoginUseCase {
  private authRepository = inject(AuthRepository);

  /**
   * Executa o login do usuário
   * @param credentials Credenciais de login (username e password)
   * @returns Resultado da autenticação
   */
  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    // Validação básica
    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        error: 'Usuário e senha são obrigatórios'
      };
    }

    if (credentials.username.trim().length < 3) {
      return {
        success: false,
        error: 'Usuário deve ter no mínimo 3 caracteres'
      };
    }

    if (credentials.password.length < 4) {
      return {
        success: false,
        error: 'Senha deve ter no mínimo 4 caracteres'
      };
    }

    // Delega para o repositório
    return await this.authRepository.login(credentials);
  }
}
