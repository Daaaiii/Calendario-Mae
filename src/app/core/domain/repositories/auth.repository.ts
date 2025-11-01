import { AuthResult, LoginCredentials, User } from '../entities/user.entity';

/**
 * Interface do repositório de autenticação
 * Define o contrato para operações de autenticação
 */
export abstract class AuthRepository {
  /**
   * Realiza login do usuário
   */
  abstract login(credentials: LoginCredentials): Promise<AuthResult>;

  /**
   * Realiza logout do usuário
   */
  abstract logout(): Promise<void>;

  /**
   * Obtém o usuário atualmente autenticado
   */
  abstract getCurrentUser(): Promise<User | null>;

  /**
   * Verifica se há um usuário autenticado
   */
  abstract isAuthenticated(): Promise<boolean>;

  /**
   * Verifica se o usuário tem permissão de administrador
   */
  abstract isAdmin(): Promise<boolean>;
}
