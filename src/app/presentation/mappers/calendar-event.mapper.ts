import { CalendarEvent } from 'angular-calendar';
import { Activity } from '../../core/domain/entities/activity.entity';
import { Holiday, EventType } from '../../core/domain/entities/holiday.entity';

/**
 * Mapper: Converte entidades de domínio para objetos de apresentação
 *
 * Segue o princípio de Responsabilidade Única (S do SOLID):
 * Responsável apenas pela conversão de dados.
 */
export class CalendarEventMapper {
  /**
   * Converte uma lista de atividades para eventos do calendário
   */
  static toCalendarEvents(activities: Activity[]): CalendarEvent[] {
    return activities.map(activity => this.toCalendarEvent(activity));
  }

  /**
   * Converte uma atividade para evento do calendário
   */
  static toCalendarEvent(activity: Activity): CalendarEvent {
    const date = this.parseDate(activity.date);

    return {
      title: activity.title,
      start: date,
      color: {
        primary: '#4228c5ff',
        secondary: '#D1E8FF'
      },
      meta: {
        activityId: activity.id,
        description: activity.description,
        eventType: EventType.ACTIVITY
      }
    };
  }

  /**
   * Converte um feriado para evento do calendário
   */
  static holidayToCalendarEvent(holiday: Holiday, color: { primary: string; secondary: string }): CalendarEvent {
    const date = this.parseDate(holiday.date);

    return {
      title: holiday.name,
      start: date,
      color: color,
      meta: {
        eventType: EventType.HOLIDAY,
        holidayType: holiday.type,
        isHoliday: true
      },
      cssClass: 'holiday-event'
    };
  }

  /**
   * Converte uma lista de feriados para eventos do calendário
   */
  static holidaysToCalendarEvents(
    holidays: Holiday[],
    getColor: (type: Holiday['type']) => { primary: string; secondary: string }
  ): CalendarEvent[] {
    return holidays.map(holiday =>
      this.holidayToCalendarEvent(holiday, getColor(holiday.type))
    );
  }

  /**
   * Parse de data sem problemas de timezone
   */
  private static parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
