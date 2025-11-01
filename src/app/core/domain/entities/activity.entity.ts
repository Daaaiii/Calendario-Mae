/**
 * Entidade de Domínio: Activity
 *
 * Representa uma atividade/evento no calendário.
 * Esta é uma entidade rica que encapsula regras de negócio.
 */
export class Activity {
  private constructor(
    public readonly id: number | undefined,
    public readonly date: string,
    public readonly title: string,
    public readonly description: string
  ) {
    this.validate();
  }

  /**
   * Factory Method para criar uma nova atividade
   */
  static create(params: {
    date: string;
    title: string;
    description: string;
  }): Activity {
    return new Activity(undefined, params.date, params.title, params.description);
  }

  /**
   * Factory Method para reconstruir uma atividade existente do banco
   */
  static fromPersistence(params: {
    id: number;
    date: string;
    title: string;
    description: string;
  }): Activity {
    return new Activity(params.id, params.date, params.title, params.description);
  }

  /**
   * Cria uma cópia da atividade com novos valores
   */
  update(params: Partial<{
    title: string;
    description: string;
    date: string;
  }>): Activity {
    return new Activity(
      this.id,
      params.date ?? this.date,
      params.title ?? this.title,
      params.description ?? this.description
    );
  }

  /**
   * Valida as regras de negócio da entidade
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('O título da atividade é obrigatório');
    }

    if (this.title.length > 100) {
      throw new Error('O título não pode ter mais de 100 caracteres');
    }

    if (!this.date || !this.isValidDate(this.date)) {
      throw new Error('Data inválida');
    }

    if (this.description && this.description.length > 500) {
      throw new Error('A descrição não pode ter mais de 500 caracteres');
    }
  }

  /**
   * Valida formato de data (YYYY-MM-DD)
   */
  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Converte para objeto simples para persistência
   */
  toPersistence(): {
    id?: number;
    date: string;
    title: string;
    description: string;
  } {
    return {
      id: this.id,
      date: this.date,
      title: this.title,
      description: this.description
    };
  }

  /**
   * Verifica se a atividade é nova (não persistida)
   */
  isNew(): boolean {
    return this.id === undefined;
  }
}
