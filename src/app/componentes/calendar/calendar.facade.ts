import { Injectable, computed, inject, signal } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { DatabaseService } from '../../services/database.service';

// Define o estado visível para o componente
interface CalendarState {
  currentDate: Date;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}

export interface Activity {
  id?: number;
  date: string;
  title: string;
  description: string;
}

// Mapeia o estado interno para o formato esperado pela biblioteca angular-calendar
const toCalendarEvents = (activities: Activity[]): CalendarEvent[] => {
  return activities.map(activity => {
    // Cria data sem conversão de timezone
    const [year, month, day] = activity.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return {
      title: activity.title,
      start: date,
      color: { primary: '#4228c5ff', secondary: '#D1E8FF' },
      meta: {
        activityId: activity.id
      }
    };
  });
};

@Injectable({
  providedIn: 'root'
})
export class CalendarFacade {
  private dbService = inject(DatabaseService);

  // Estado interno da aplicação
  private state = signal<CalendarState>({
    currentDate: new Date(),
    activities: [],
    isLoading: true,
    error: null,
  });

  // Estado público (signals computados para a UI)
  readonly currentDate = computed(() => this.state().currentDate);
  readonly calendarEvents = computed(() => toCalendarEvents(this.state().activities));
  readonly isLoading = computed(() => this.state().isLoading);

  constructor() {
    this.loadActivities();
  }

  // Ação: Carregar todas as atividades do banco de dados
  async loadActivities(): Promise<void> {
    this.state.update(s => ({ ...s, isLoading: true, error: null }));

    try {
      const activities = await this.dbService.getAllActivities();
      this.state.update(s => ({ ...s, activities, isLoading: false }));
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      this.state.update(s => ({
        ...s,
        isLoading: false,
        error: 'Erro ao carregar atividades'
      }));
    }
  }

  // Ação: Mudar a data do calendário
  setCurrentDate(date: Date): void {
    this.state.update(s => ({ ...s, currentDate: date }));
  }

  // Ação: Inserir ou atualizar uma atividade
  async saveActivity(activity: Activity): Promise<boolean> {
    try {
      if (activity.id) {
        console.log(`Atualizando atividade ID: ${activity.id}`);
      } else {
        console.log(`Criando nova atividade para: ${activity.date}`);
      }

      const savedActivity = await this.dbService.saveActivity(activity);

      // Atualiza o estado local após salvar no banco
      this.state.update(s => ({
        ...s,
        activities: activity.id
          ? s.activities.map(a => a.id === activity.id ? savedActivity : a)
          : [...s.activities, savedActivity]
      }));

      return true;
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      return false;
    }
  }

  // Ação: Excluir uma atividade por ID
  async deleteActivity(id: number): Promise<boolean> {
    try {
      console.log(`Excluindo atividade ID: ${id}`);

      await this.dbService.deleteActivity(id);

      // Atualiza o estado local após excluir do banco
      this.state.update(s => ({
        ...s,
        activities: s.activities.filter(a => a.id !== id)
      }));

      return true;
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      return false;
    }
  }

  // Buscar todas as atividades de uma data específica
  getActivitiesByDate(date: string): Activity[] {
    return this.state().activities.filter(a => a.date === date);
  }

  // Buscar uma atividade específica por ID
  async getActivityById(id: number): Promise<Activity | undefined> {
    try {
      return await this.dbService.getActivityById(id);
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      return this.state().activities.find(a => a.id === id);
    }
  }

  // Limpar todos os dados (útil para testes ou reset)
  async clearAllData(): Promise<void> {
    try {
      await this.dbService.clearAllData();
      this.state.update(s => ({ ...s, activities: [] }));
      console.log('Todos os dados foram limpos');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
}
