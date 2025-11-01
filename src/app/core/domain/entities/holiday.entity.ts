/**
 * Tipos de eventos do calendário
 */
export enum EventType {
  ACTIVITY = 'activity',
  HOLIDAY = 'holiday'
}

/**
 * Interface para feriados
 */
export interface Holiday {
  date: string;
  name: string;
  type: 'national' | 'religious' | 'optional' | 'state';
}

/**
 * Feriados Nacionais do Brasil
 *
 * Inclui feriados fixos e móveis (calculados)
 */
export const BRAZILIAN_HOLIDAYS: Holiday[] = [
  // === 2025 ===
  { date: '2025-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2025-02-17', name: 'Carnaval', type: 'optional' },
  { date: '2025-04-18', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2025-04-20', name: 'Páscoa', type: 'religious' },
  { date: '2025-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2025-05-01', name: 'Dia do Trabalho', type: 'national' },
  { date: '2025-06-19', name: 'Corpus Christi', type: 'religious' },
  { date: '2025-09-07', name: 'Independência do Brasil', type: 'national' },
  { date: '2025-09-20', name: 'Revolução Farroupilha (RS)', type: 'state' },
  { date: '2025-10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
  { date: '2025-11-02', name: 'Finados', type: 'national' },
  { date: '2025-11-15', name: 'Proclamação da República', type: 'national' },
  { date: '2025-11-20', name: 'Consciência Negra', type: 'national' },
  { date: '2025-12-25', name: 'Natal', type: 'religious' },

  // === 2026 ===
  { date: '2026-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2026-02-16', name: 'Carnaval', type: 'optional' },
  { date: '2026-04-03', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2026-04-05', name: 'Páscoa', type: 'religious' },
  { date: '2026-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2026-05-01', name: 'Dia do Trabalho', type: 'national' },
  { date: '2026-06-04', name: 'Corpus Christi', type: 'religious' },
  { date: '2026-09-07', name: 'Independência do Brasil', type: 'national' },
  { date: '2026-09-20', name: 'Revolução Farroupilha (RS)', type: 'state' },
  { date: '2026-10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
  { date: '2026-11-02', name: 'Finados', type: 'national' },
  { date: '2026-11-15', name: 'Proclamação da República', type: 'national' },
  { date: '2026-11-20', name: 'Consciência Negra', type: 'national' },
  { date: '2026-12-25', name: 'Natal', type: 'religious' },

  // === 2027 ===
  { date: '2027-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2027-02-08', name: 'Carnaval', type: 'optional' },
  { date: '2027-03-26', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2027-03-28', name: 'Páscoa', type: 'religious' },
  { date: '2027-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2027-05-01', name: 'Dia do Trabalho', type: 'national' },
  { date: '2027-05-27', name: 'Corpus Christi', type: 'religious' },
  { date: '2027-09-07', name: 'Independência do Brasil', type: 'national' },
  { date: '2027-09-20', name: 'Revolução Farroupilha (RS)', type: 'state' },
  { date: '2027-10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
  { date: '2027-11-02', name: 'Finados', type: 'national' },
  { date: '2027-11-15', name: 'Proclamação da República', type: 'national' },
  { date: '2027-11-20', name: 'Consciência Negra', type: 'national' },
  { date: '2027-12-25', name: 'Natal', type: 'religious' },

  // === 2028 ===
  { date: '2028-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2028-02-28', name: 'Carnaval', type: 'optional' },
  { date: '2028-04-14', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2028-04-16', name: 'Páscoa', type: 'religious' },
  { date: '2028-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2028-05-01', name: 'Dia do Trabalho', type: 'national' },
  { date: '2028-06-15', name: 'Corpus Christi', type: 'religious' },
  { date: '2028-09-07', name: 'Independência do Brasil', type: 'national' },
  { date: '2028-09-20', name: 'Revolução Farroupilha (RS)', type: 'state' },
  { date: '2028-10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
  { date: '2028-11-02', name: 'Finados', type: 'national' },
  { date: '2028-11-15', name: 'Proclamação da República', type: 'national' },
  { date: '2028-11-20', name: 'Consciência Negra', type: 'national' },
  { date: '2028-12-25', name: 'Natal', type: 'religious' },

  // === 2029 ===
  { date: '2029-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2029-02-12', name: 'Carnaval', type: 'optional' },
  { date: '2029-03-30', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2029-04-01', name: 'Páscoa', type: 'religious' },
  { date: '2029-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2029-05-01', name: 'Dia do Trabalho', type: 'national' },
  { date: '2029-05-31', name: 'Corpus Christi', type: 'religious' },
  { date: '2029-09-07', name: 'Independência do Brasil', type: 'national' },
  { date: '2029-09-20', name: 'Revolução Farroupilha (RS)', type: 'state' },
  { date: '2029-10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
  { date: '2029-11-02', name: 'Finados', type: 'national' },
  { date: '2029-11-15', name: 'Proclamação da República', type: 'national' },
  { date: '2029-11-20', name: 'Consciência Negra', type: 'national' },
  { date: '2029-12-25', name: 'Natal', type: 'religious' },

  // === 2030 ===
  { date: '2030-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2030-03-04', name: 'Carnaval', type: 'optional' },
  { date: '2030-04-19', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2030-04-21', name: 'Páscoa', type: 'religious' },
  { date: '2030-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2030-05-01', name: 'Dia do Trabalho', type: 'national' },
  { date: '2030-06-20', name: 'Corpus Christi', type: 'religious' },
  { date: '2030-09-07', name: 'Independência do Brasil', type: 'national' },
  { date: '2030-09-20', name: 'Revolução Farroupilha (RS)', type: 'state' },
  { date: '2030-10-12', name: 'Nossa Senhora Aparecida', type: 'religious' },
  { date: '2030-11-02', name: 'Finados', type: 'national' },
  { date: '2030-11-15', name: 'Proclamação da República', type: 'national' },
  { date: '2030-11-20', name: 'Consciência Negra', type: 'national' },
  { date: '2030-12-25', name: 'Natal', type: 'religious' }
];
