import { Injectable, signal, computed } from '@angular/core';
import { LoginUseCase } from '../../core/application/use-cases/login.use-case';
import { LogoutUseCase } from '../../core/application/use-cases/logout.use-case';
import { GetCurrentUserUseCase } from '../../core/application/use-cases/get-current-user.use-case';
import { User, LoginCredentials } from '../../core/domain/entities/user.entity';

/**
 * Gerenciador de estado de autenticação
 *
 * Coordena os use cases de autenticação e mantém estado reativo
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStateManager {
  // Use Cases
  private loginUseCase = new LoginUseCase();
  private logoutUseCase = new LogoutUseCase();
  private getCurrentUserUseCase = new GetCurrentUserUseCase();

  // Estado
  private currentUserSignal = signal<User | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  currentUser = computed(() => this.currentUserSignal());
  isLoading = computed(() => this.isLoadingSignal());
  error = computed(() => this.errorSignal());
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor() {
    this.loadCurrentUser();
  }

  /**
   * Carrega usuário atual do storage
   */
  private async loadCurrentUser(): Promise<void> {
    const user = await this.getCurrentUserUseCase.execute();
    this.currentUserSignal.set(user);
  }

  /**
   * Realiza login
   */
  async login(credentials: LoginCredentials): Promise<boolean> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const result = await this.loginUseCase.execute(credentials);

      if (result.success && result.user) {
        this.currentUserSignal.set(result.user);
        this.errorSignal.set(null);
        return true;
      } else {
        this.errorSignal.set(result.error || 'Erro ao realizar login');
        return false;
      }
    } catch (error) {
      this.errorSignal.set('Erro inesperado ao realizar login');
      return false;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Realiza logout
   */
  async logout(): Promise<void> {
    this.isLoadingSignal.set(true);

    try {
      await this.logoutUseCase.execute();
      this.currentUserSignal.set(null);
      this.errorSignal.set(null);
    } catch (error) {
      this.errorSignal.set('Erro ao realizar logout');
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Limpa erro
   */
  clearError(): void {
    this.errorSignal.set(null);
  }
}
