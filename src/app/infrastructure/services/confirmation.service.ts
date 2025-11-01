import { Injectable, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { ConfirmationComponent, ConfirmationConfig } from '../../componentes/confirmation/confirmation';

/**
 * Serviço de Confirmação
 *
 * Gerencia modais de confirmação
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationRef: ComponentRef<ConfirmationComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  /**
   * Mostra um modal de confirmação
   */
  confirm(config: Omit<ConfirmationConfig, 'onConfirm' | 'onCancel'> & {
    onConfirm: () => void;
    onCancel?: () => void;
  }): void {
    // Se já existe um modal de confirmação, remove
    if (this.confirmationRef) {
      this.close();
    }

    // Cria o componente
    this.confirmationRef = createComponent(ConfirmationComponent, {
      environmentInjector: this.injector
    });

    // Adiciona ao DOM
    document.body.appendChild(this.confirmationRef.location.nativeElement);
    this.appRef.attachView(this.confirmationRef.hostView);

    // Mostra o modal com callback para fechar após ação
    const originalOnConfirm = config.onConfirm;
    const originalOnCancel = config.onCancel;

    this.confirmationRef.instance.show({
      ...config,
      onConfirm: () => {
        originalOnConfirm();
        this.close();
      },
      onCancel: () => {
        if (originalOnCancel) {
          originalOnCancel();
        }
        this.close();
      }
    });
  }

  /**
   * Fecha o modal de confirmação
   */
  private close(): void {
    if (this.confirmationRef) {
      this.appRef.detachView(this.confirmationRef.hostView);
      this.confirmationRef.destroy();
      this.confirmationRef = null;
    }
  }
}
