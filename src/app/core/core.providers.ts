import { Provider } from '@angular/core';
import { ActivityRepository } from '../core/domain/repositories/activity.repository';
import { SqliteActivityRepository } from '../infrastructure/repositories/sqlite-activity.repository';
import { AuthRepository } from '../core/domain/repositories/auth.repository';
import { LocalStorageAuthRepository } from '../infrastructure/repositories/local-storage-auth.repository';

/**
 * Providers para Injeção de Dependência
 *
 * Configura o binding entre interfaces e implementações.
 * Segue o princípio de Inversão de Dependência (D do SOLID).
 */
export const CORE_PROVIDERS: Provider[] = [
  {
    provide: ActivityRepository,
    useClass: SqliteActivityRepository
  },
  {
    provide: AuthRepository,
    useClass: LocalStorageAuthRepository
  }
];
