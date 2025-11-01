import { Injectable, signal, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { NotificationComponent, NotificationConfig } from '../../componentes/notification/notification';

/**
 * Serviço de Notificações
 *
 * Gerencia a exibição de notificações modais
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationRef: ComponentRef<NotificationComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  /**
   * Mostra uma notificação de sucesso
   */
  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  /**
   * Mostra uma notificação de erro
   */
  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  /**
   * Mostra uma notificação de aviso
   */
  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  /**
   * Mostra uma notificação informativa
   */
  info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }

  /**
   * Mostra uma notificação
   */
  private show(config: NotificationConfig): void {
    // Se já existe uma notificação, remove
    if (this.notificationRef) {
      this.close();
    }

    // Cria o componente
    this.notificationRef = createComponent(NotificationComponent, {
      environmentInjector: this.injector
    });

    // Adiciona ao DOM
    document.body.appendChild(this.notificationRef.location.nativeElement);
    this.appRef.attachView(this.notificationRef.hostView);

    // Mostra a notificação
    this.notificationRef.instance.show(config);
  }

  /**
   * Fecha a notificação atual
   */
  private close(): void {
    if (this.notificationRef) {
      this.appRef.detachView(this.notificationRef.hostView);
      this.notificationRef.destroy();
      this.notificationRef = null;
    }
  }
}
