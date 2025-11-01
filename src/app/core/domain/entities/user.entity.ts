/**
 * Entidade User - Representa um usuário do sistema
 */
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'viewer';
}

/**
 * Credenciais de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Resultado da autenticação
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
