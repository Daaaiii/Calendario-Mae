import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateManager } from '../../presentation/state/auth-state.manager';

/**
 * Componente de Login
 *
 * Interface para autenticação de usuários administradores
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  showPassword = signal(false);

  constructor(
    public authStateManager: AuthStateManager,
    private router: Router
  ) {
    // Se já estiver autenticado, redireciona para home
    if (this.authStateManager.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Alterna visibilidade da senha
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  /**
   * Realiza login
   */
  async onSubmit(): Promise<void> {
    const success = await this.authStateManager.login({
      username: this.username(),
      password: this.password()
    });

    if (success) {
      // Redireciona para home após login bem-sucedido
      this.router.navigate(['/']);
    }
  }

  /**
   * Atualiza username
   */
  updateUsername(value: string): void {
    this.username.set(value);
  }

  /**
   * Atualiza password
   */
  updatePassword(value: string): void {
    this.password.set(value);
  }
}
