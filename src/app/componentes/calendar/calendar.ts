import { Component, OnInit, inject, signal, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Subject } from 'rxjs';
import { CalendarStateManager } from '../../presentation/state/calendar-state.manager';
import { AuthStateManager } from '../../presentation/state/auth-state.manager';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { ActivityDto } from '../../presentation/models/activity.dto';
import {
  CalendarView,
  DateAdapter,
  CalendarMonthViewComponent,
  CalendarUtils,
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTitleFormatter,
  CalendarEvent
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ActivityComponent } from '../activity/activity';
import { Router } from '@angular/router';


// Registra o locale português
registerLocaleData(localePt);


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarMonthViewComponent, ActivityComponent],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  // Injeção do State Manager
  private stateManager = inject(CalendarStateManager);
  public authStateManager = inject(AuthStateManager);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  // Exposição do estado para o template
  calendarEvents = this.stateManager.calendarEvents;
  currentDate = this.stateManager.currentDate;
  isLoading = this.stateManager.isLoading;
  activeDayIsOpen: boolean = false;
  viewDate: Date = new Date();

  view: CalendarView = CalendarView.Month;
  locale: string = 'pt-BR';

  // Subject para refresh do calendário
  refresh$ = new Subject<void>();

  // Estado local para o formulário
  selectedActivity = signal<ActivityDto | null>(null);
  selectedDate = signal<Date | null>(null);
  openDayEvents: CalendarEvent[] = [];

  // Controle de duplo clique
  private clickTimeout: any = null;
  private clickCount = 0;

  constructor() { }

  ngOnInit(): void {
    console.log('✅ Calendar component initialized');
  }

  /**
   * Altera a visualização do calendário
   */
  changeView(): void {
    this.view = CalendarView.Month;
  }

  /**
   * Navega para o mês anterior
   */
  previousMonth(): void {
    const currentDate = this.currentDate();
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    this.stateManager.setCurrentDate(newDate);
  }

  /**
   * Navega para o próximo mês
   */
  nextMonth(): void {
    const currentDate = this.currentDate();
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    this.stateManager.setCurrentDate(newDate);
  }

  /**
   * Volta para o mês atual (hoje)
   */
  goToToday(): void {
    this.stateManager.setCurrentDate(new Date());
  }

  /**
   * Trata o clique do usuário em uma data.
   * Clique simples: abre/fecha o preview com título
   * Duplo clique: abre o modal de criação (novo evento)
   */
  async handleDayClick({ date, events }: { date: Date; events: CalendarEvent[] }): Promise<void> {
    const dateString = date.toISOString().split('T')[0];

    this.clickCount++;

    if (this.clickCount === 1) {
      // Primeiro clique - aguarda para ver se é duplo clique
      this.clickTimeout = setTimeout(async () => {
        // Clique simples: apenas toggle do preview
        const activities = this.stateManager.getActivitiesByDate(dateString);

        if (activities.length > 0 && events.length > 0) {
          if (this.activeDayIsOpen && this.openDayEvents === events) {
            // Se já está aberto com os mesmos eventos, fecha
            this.activeDayIsOpen = false;
            this.openDayEvents = [];
          } else {
            // Abre e carrega os eventos do dia
            this.activeDayIsOpen = true;
            this.openDayEvents = events;
          }
        } else {
          this.activeDayIsOpen = false;
          this.openDayEvents = [];
        }
        this.clickCount = 0;
      }, 300); // 300ms para detectar duplo clique
    } else if (this.clickCount === 2) {
      // Duplo clique: cria um NOVO evento (apenas para admins)
      clearTimeout(this.clickTimeout);
      this.clickCount = 0;
      this.activeDayIsOpen = false;
      this.openDayEvents = [];

      // Verifica se é admin antes de permitir criação
      if (!this.authStateManager.isAdmin()) {
        this.notificationService.warning('Apenas administradores podem criar novas atividades. Faça login para continuar.', 4000);
        return;
      }

      this.selectedDate.set(date);
      // Sempre cria novo evento no duplo clique
      this.selectedActivity.set({ date: dateString, title: '', description: '' });

      console.log(`Criar novo evento para a data: ${dateString}`);
    }
  }

  /**
   * Trata o clique em um evento específico - abre para edição
   */
  async handleEventClick({ event }: { event: CalendarEvent }): Promise<void> {
    const activityId = event.meta?.activityId;

    // Verifica se activityId é um número (incluindo 0)
    if (activityId !== undefined && activityId !== null && typeof activityId === 'number') {
      const activity = await this.stateManager.getActivityById(activityId);

      if (activity) {
        this.activeDayIsOpen = false;
        this.openDayEvents = [];

        this.selectedDate.set(event.start);
        this.selectedActivity.set({
          id: activity.id,
          date: activity.date,
          title: activity.title,
          description: activity.description
        });
      }
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /**
   * Adiciona um novo evento para o dia selecionado
   */
  addNewEventToDay(date: Date): void {
    const dateString = date.toISOString().split('T')[0];
    this.selectedDate.set(date);
    this.selectedActivity.set({ date: dateString, title: '', description: '' });
    this.activeDayIsOpen = false; // Fecha o preview
  }

  /**
   * Chamado pelo componente de formulário (após o usuário salvar).
   */
  async onActivitySave(activity: ActivityDto): Promise<void> {
    const success = await this.stateManager.saveActivity(activity);

    if (success) {
      this.activeDayIsOpen = false;
      this.openDayEvents = [];
      this.closeForm();

      // Força o refresh do calendário
      this.refresh$.next();
    }
  }  /**
   * Chamado pelo componente de formulário (após o usuário excluir).
   */
  onActivityDelete(activity: ActivityDto): void {
    if (activity.id) {
      this.stateManager.deleteActivity(activity.id);
    }
    this.activeDayIsOpen = false;
    this.closeForm();
  }

  closeForm(): void {
    this.selectedActivity.set(null);
    this.selectedDate.set(null);
  }

  /**
   * Navega para tela de login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Realiza logout
   */
  async logout(): Promise<void> {
    await this.authStateManager.logout();
  }
}
