import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * Componente de Modal de Confirmação
 */
@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class ConfirmationComponent {
  isVisible = signal(false);
  title = signal('Confirmação');
  message = signal('');
  confirmText = signal('Confirmar');
  cancelText = signal('Cancelar');

  private onConfirmCallback?: () => void;
  private onCancelCallback?: () => void;

  /**
   * Mostra o modal de confirmação
   */
  show(config: ConfirmationConfig): void {
    this.title.set(config.title);
    this.message.set(config.message);
    this.confirmText.set(config.confirmText || 'Confirmar');
    this.cancelText.set(config.cancelText || 'Cancelar');
    this.onConfirmCallback = config.onConfirm;
    this.onCancelCallback = config.onCancel;
    this.isVisible.set(true);
  }

  /**
   * Fecha o modal
   */
  close(): void {
    this.isVisible.set(false);
  }

  /**
   * Confirma a ação
   */
  confirm(): void {
    this.close();
    if (this.onConfirmCallback) {
      this.onConfirmCallback();
    }
  }

  /**
   * Cancela a ação
   */
  cancel(): void {
    this.close();
    if (this.onCancelCallback) {
      this.onCancelCallback();
    }
  }
}
