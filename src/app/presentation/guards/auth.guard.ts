import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateManager } from '../state/auth-state.manager';

/**
 * Guard de autenticação
 * Verifica se o usuário está autenticado antes de acessar rotas protegidas
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authStateManager = inject(AuthStateManager);
  const router = inject(Router);

  if (authStateManager.isAuthenticated()) {
    return true;
  }

  // Redireciona para login
  return router.parseUrl('/login');
};

/**
 * Guard de administrador
 * Verifica se o usuário é administrador
 */
export const adminGuard: CanActivateFn = async (route, state) => {
  const authStateManager = inject(AuthStateManager);
  const router = inject(Router);

  if (authStateManager.isAdmin()) {
    return true;
  }

  // Redireciona para home se não for admin
  return router.parseUrl('/');
};
