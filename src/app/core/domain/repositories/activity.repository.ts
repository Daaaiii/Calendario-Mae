import { Activity } from '../entities/activity.entity';

/**
 * Interface de Repositório (Port)
 *
 * Define o contrato para persistência de atividades.
 * Segue o princípio de Inversão de Dependência (D do SOLID):
 * O domínio define a interface, a infraestrutura implementa.
 */
export abstract class ActivityRepository {
  /**
   * Busca todas as atividades
   */
  abstract findAll(): Promise<Activity[]>;

  /**
   * Busca atividades por data específica
   */
  abstract findByDate(date: string): Promise<Activity[]>;

  /**
   * Busca uma atividade por ID
   */
  abstract findById(id: number): Promise<Activity | null>;

  /**
   * Salva uma nova atividade ou atualiza existente
   */
  abstract save(activity: Activity): Promise<Activity>;

  /**
   * Remove uma atividade
   */
  abstract delete(id: number): Promise<void>;

  /**
   * Remove todas as atividades
   */
  abstract deleteAll(): Promise<void>;
}
