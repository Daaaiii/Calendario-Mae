import { Injectable, computed, inject, signal } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Activity } from '../../core/domain/entities/activity.entity';
import { LoadActivitiesUseCase } from '../../core/application/use-cases/load-activities.use-case';
import { LoadActivitiesByDateUseCase } from '../../core/application/use-cases/load-activities-by-date.use-case';
import { GetActivityByIdUseCase } from '../../core/application/use-cases/get-activity-by-id.use-case';
import { SaveActivityUseCase } from '../../core/application/use-cases/save-activity.use-case';
import { DeleteActivityUseCase } from '../../core/application/use-cases/delete-activity.use-case';
import { ClearAllActivitiesUseCase } from '../../core/application/use-cases/clear-all-activities.use-case';
import { CalendarEventMapper } from '../mappers/calendar-event.mapper';
import { ActivityDto } from '../models/activity.dto';
import { DatabaseSeeder } from '../../infrastructure/database/database-seeder.service';
import { HolidayService } from '../../infrastructure/services/holiday.service';

/**
 * Estado do Calendário
 */
interface CalendarState {
  currentDate: Date;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Gerenciador de Estado do Calendário
 *
 * Segue o padrão Facade para simplificar a interação com múltiplos Use Cases.
 * Gerencia o estado reativo da aplicação usando Signals do Angular.
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarStateManager {
  // Injeção de Use Cases
  private loadActivitiesUseCase = inject(LoadActivitiesUseCase);
  private loadActivitiesByDateUseCase = inject(LoadActivitiesByDateUseCase);
  private getActivityByIdUseCase = inject(GetActivityByIdUseCase);
  private saveActivityUseCase = inject(SaveActivityUseCase);
  private deleteActivityUseCase = inject(DeleteActivityUseCase);
  private clearAllActivitiesUseCase = inject(ClearAllActivitiesUseCase);
  private databaseSeeder = inject(DatabaseSeeder);
  private holidayService = inject(HolidayService);

  // Estado privado
  private state = signal<CalendarState>({
    currentDate: new Date(),
    activities: [],
    isLoading: true,
    error: null,
  });

  // Seletores públicos (computed signals)
  readonly currentDate = computed(() => this.state().currentDate);
  readonly activities = computed(() => this.state().activities);
  readonly calendarEvents = computed(() => {
    // Combina atividades e feriados
    const activityEvents = CalendarEventMapper.toCalendarEvents(this.state().activities);
    const holidayEvents = CalendarEventMapper.holidaysToCalendarEvents(
      this.holidayService.getAllHolidays(),
      (type) => this.holidayService.getHolidayColor(type)
    );

    return [...activityEvents, ...holidayEvents];
  });
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  constructor() {
    this.initialize();
  }

  /**
   * Inicializa o estado carregando as atividades
   */
  private async initialize(): Promise<void> {
    // Executa o seed se necessário
    await this.databaseSeeder.seed();

    // Carrega as atividades
    await this.loadActivities();
  }

  /**
   * Carrega todas as atividades
   */
  async loadActivities(): Promise<void> {
    try {
      this.setLoading(true);
      const activities = await this.loadActivitiesUseCase.execute();
      this.setActivities(activities);
      this.setError(null);
    } catch (error) {
      this.handleError('Erro ao carregar atividades', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Obtém atividades de uma data específica
   */
  getActivitiesByDate(date: string): Activity[] {
    return this.state().activities.filter(a => a.date === date);
  }

  /**
   * Busca uma atividade por ID
   */
  async getActivityById(id: number): Promise<Activity | null> {
    try {
      return await this.getActivityByIdUseCase.execute(id);
    } catch (error) {
      this.handleError('Erro ao buscar atividade', error);
      return null;
    }
  }

  /**
   * Salva uma atividade (criar ou atualizar)
   */
  async saveActivity(dto: ActivityDto): Promise<boolean> {
    try {
      const savedActivity = await this.saveActivityUseCase.execute(dto);

      // Atualiza o estado local
      this.updateActivityInState(savedActivity);

      return true;
    } catch (error) {
      this.handleError('Erro ao salvar atividade', error);
      return false;
    }
  }

  /**
   * Exclui uma atividade
   */
  async deleteActivity(id: number): Promise<boolean> {
    try {
      await this.deleteActivityUseCase.execute(id);

      // Remove do estado local
      this.removeActivityFromState(id);

      return true;
    } catch (error) {
      this.handleError('Erro ao excluir atividade', error);
      return false;
    }
  }

  /**
   * Limpa todas as atividades
   */
  async clearAllActivities(): Promise<void> {
    try {
      await this.clearAllActivitiesUseCase.execute();
      this.setActivities([]);
    } catch (error) {
      this.handleError('Erro ao limpar atividades', error);
    }
  }

  /**
   * Atualiza a data atual do calendário
   */
  setCurrentDate(date: Date): void {
    this.state.update(s => ({ ...s, currentDate: date }));
  }

  // Métodos privados para manipulação de estado

  private setLoading(isLoading: boolean): void {
    this.state.update(s => ({ ...s, isLoading }));
  }

  private setActivities(activities: Activity[]): void {
    this.state.update(s => ({ ...s, activities }));
  }

  private setError(error: string | null): void {
    this.state.update(s => ({ ...s, error }));
  }

  private updateActivityInState(activity: Activity): void {
    this.state.update(s => {
      const exists = s.activities.some(a => a.id === activity.id);

      const activities = exists
        ? s.activities.map(a => a.id === activity.id ? activity : a)
        : [...s.activities, activity];

      return { ...s, activities };
    });
  }

  private removeActivityFromState(id: number): void {
    this.state.update(s => ({
      ...s,
      activities: s.activities.filter(a => a.id !== id)
    }));
  }

  private handleError(message: string, error: unknown): void {
    console.error(`❌ ${message}:`, error);
    this.setError(message);
  }
}
