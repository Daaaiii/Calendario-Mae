import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  message: string;
  type: NotificationType;
  duration?: number;
}

/**
 * Componente de Notificação Modal
 *
 * Exibe notificações elegantes ao usuário
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent {
  isVisible = signal(false);
  message = signal('');
  type = signal<NotificationType>('info');

  /**
   * Mostra uma notificação
   */
  show(config: NotificationConfig): void {
    this.message.set(config.message);
    this.type.set(config.type);
    this.isVisible.set(true);

    // Auto-fecha após duração especificada (padrão: 3 segundos)
    if (config.duration !== 0) {
      const duration = config.duration || 3000;
      setTimeout(() => this.close(), duration);
    }
  }

  /**
   * Fecha a notificação
   */
  close(): void {
    this.isVisible.set(false);
  }

  /**
   * Retorna o ícone baseado no tipo
   */
  getIcon(): string {
    switch (this.type()) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }
}
