import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../core/domain/repositories/auth.repository';
import { AuthResult, LoginCredentials, User } from '../../core/domain/entities/user.entity';
import { SqliteDatabaseService } from '../database/sqlite-database.service';

/**
 * Implementação do repositório de autenticação
 *
 * Usa SQLite para armazenar usuários e localStorage para sessão
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageAuthRepository extends AuthRepository {
  private readonly STORAGE_KEY = 'calendar_auth';
  private db = inject(SqliteDatabaseService);

  constructor() {
    super();
    this.initializeDefaultUsers();
  }

  /**
   * Inicializa usuário administrador padrão se não existir
   */
  private async initializeDefaultUsers(): Promise<void> {
    try {
      await this.db.waitForInit();

      // Verifica se já existe algum usuário
      const users = await this.db.executeQuery('SELECT COUNT(*) as count FROM users');
      const count = users[0]?.[0] as number;

      if (count === 0) {
        // Cria usuários administradores padrão
        const defaultAdmins = [
          { username: 'Dai', password: 'Dai123$4' },
          { username: 'Cledi', password: 'Cledi1753' }
        ];

        for (const admin of defaultAdmins) {
          await this.db.executeCommand(
            'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
            [admin.username, admin.password, 1] // 1 = admin
          );
          console.log(`👤 Usuário admin '${admin.username}' criado`);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar usuários:', error);
    }
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Busca usuário no banco
      const results = await this.db.executeQuery(
        'SELECT id, username, isAdmin FROM users WHERE username = ? AND password = ?',
        [credentials.username, credentials.password]
      );

      if (results.length === 0) {
        return {
          success: false,
          error: 'Usuário ou senha inválidos'
        };
      }

      const userRow = results[0];
      const user: User = {
        id: String(userRow[0]),
        username: userRow[1] as string,
        role: (userRow[2] as number) === 1 ? 'admin' : 'viewer'
      };

      // Cria sessão no localStorage
      const session = {
        user,
        token: this.generateToken(),
        timestamp: Date.now()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));

      return {
        success: true,
        user,
        token: session.token
      };
    } catch (error) {
      console.error('❌ Erro ao realizar login:', error);
      return {
        success: false,
        error: 'Erro ao realizar login'
      };
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Obtém o usuário atualmente autenticado
   */
  async getCurrentUser(): Promise<User | null> {
    const sessionJson = localStorage.getItem(this.STORAGE_KEY);
    if (!sessionJson) {
      return null;
    }

    try {
      const session = JSON.parse(sessionJson);
      return session.user;
    } catch {
      return null;
    }
  }

  /**
   * Verifica se há um usuário autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Verifica se o usuário tem permissão de administrador
   */
  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * Gera um token simples (em produção, use JWT)
   */
  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}
