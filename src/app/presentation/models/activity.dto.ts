/**
 * DTO para transferência de dados de atividades
 *
 * Usado na camada de apresentação para desacoplar a UI da entidade de domínio.
 */
export interface ActivityDto {
  id?: number;
  date: string;
  title: string;
  description: string;
}
