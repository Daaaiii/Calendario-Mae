import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityDto } from '../../presentation/models/activity.dto';
import { AuthStateManager } from '../../presentation/state/auth-state.manager';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { ConfirmationService } from '../../infrastructure/services/confirmation.service';


@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity.html',
  styleUrl: './activity.css'
})
export class ActivityComponent implements OnInit {
  @Input() activity!: ActivityDto;

  // Emite a atividade salva
  @Output() save = new EventEmitter<ActivityDto>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<ActivityDto>();

  // Injeção do gerenciador de autenticação
  public authStateManager = inject(AuthStateManager);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);

  // Cópia local da atividade para edição
  editedActivity: ActivityDto = { date: '', title: '', description: '' };

  ngOnInit(): void {
    // Ao iniciar, cria uma cópia profunda da atividade recebida via Input
    // para que as edições no formulário não afetem o objeto original até que seja salvo.
    if (this.activity) {
      this.editedActivity = { ...this.activity };
    }
  }

  onSave(): void {
    // Garante que a data não seja vazia (você pode adicionar mais validações)
    if (!this.editedActivity.date || !this.editedActivity.title) {
        this.notificationService.warning('Por favor, preencha o título da atividade.');
        return;
    }
    // Emite a atividade editada/criada
    this.save.emit(this.editedActivity);
  }

  onCancel(): void {
    // Emite o evento de cancelamento
    this.cancel.emit();
  }

  onDelete(): void {
    this.confirmationService.confirm({
      title: 'Excluir Atividade',
      message: 'Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      onConfirm: () => {
        this.delete.emit(this.editedActivity);
        this.notificationService.success('Atividade excluída com sucesso!');
      }
    });
  }

  onOverlayClick(event: MouseEvent): void {
    // Fecha o modal ao clicar no overlay (fundo escuro)
    this.onCancel();
  }
}
