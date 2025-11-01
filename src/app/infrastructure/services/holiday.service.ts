import { Injectable } from '@angular/core';
import { BRAZILIAN_HOLIDAYS, Holiday } from '../../core/domain/entities/holiday.entity';

/**
 * Serviço para gerenciar feriados
 *
 * Fornece informações sobre feriados nacionais brasileiros.
 */
@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private holidays: Map<string, Holiday> = new Map();

  constructor() {
    this.initializeHolidays();
  }

  /**
   * Inicializa o mapa de feriados para acesso rápido
   */
  private initializeHolidays(): void {
    BRAZILIAN_HOLIDAYS.forEach(holiday => {
      this.holidays.set(holiday.date, holiday);
    });
  }

  /**
   * Verifica se uma data é feriado
   */
  isHoliday(date: string): boolean {
    return this.holidays.has(date);
  }

  /**
   * Obtém informações do feriado de uma data
   */
  getHoliday(date: string): Holiday | undefined {
    return this.holidays.get(date);
  }

  /**
   * Obtém todos os feriados
   */
  getAllHolidays(): Holiday[] {
    return BRAZILIAN_HOLIDAYS;
  }

  /**
   * Obtém feriados de um ano específico
   */
  getHolidaysByYear(year: number): Holiday[] {
    return BRAZILIAN_HOLIDAYS.filter(holiday =>
      holiday.date.startsWith(year.toString())
    );
  }

  /**
   * Obtém feriados de um mês específico
   */
  getHolidaysByMonth(year: number, month: number): Holiday[] {
    const monthStr = month.toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;

    return BRAZILIAN_HOLIDAYS.filter(holiday =>
      holiday.date.startsWith(prefix)
    );
  }

  /**
   * Obtém a cor para um tipo de feriado
   */
  getHolidayColor(type: Holiday['type']): { primary: string; secondary: string } {
    switch (type) {
      case 'national':
        return { primary: '#dc3545', secondary: '#f8d7da' }; // Vermelho
      case 'religious':
        return { primary: '#ffc107', secondary: '#fff3cd' }; // Amarelo/Dourado
      case 'optional':
        return { primary: '#6c757d', secondary: '#e2e3e5' }; // Cinza
      case 'state':
        return { primary: '#17a2b8', secondary: '#d1ecf1' }; // Azul turquesa
      default:
        return { primary: '#dc3545', secondary: '#f8d7da' };
    }
  }
}
