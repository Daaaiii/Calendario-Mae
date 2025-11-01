import { ApplicationRef } from '@angular/core';
import { DatabaseSeeder } from './infrastructure/database/database-seeder.service';
import { ClearAllActivitiesUseCase } from './core/application/use-cases/clear-all-activities.use-case';

/**
 * Utilitários de desenvolvimento para o console
 *
 * Expõe funções globais para facilitar o desenvolvimento e testes.
 * Estas funções estarão disponíveis no console do navegador como window.dev
 */
export class DevTools {
  static appRef: ApplicationRef;

  /**
   * Inicializa as ferramentas de desenvolvimento
   */
  static init(appRef: ApplicationRef): void {
    this.appRef = appRef;

    // Expõe as funções no objeto window
    (window as any).dev = {
      seed: () => this.runSeed(),
      forceSeed: () => this.runForceSeed(),
      clearDatabase: () => this.clearDatabase(),
      help: () => this.showHelp()
    };

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🛠️  FERRAMENTAS DE DESENVOLVIMENTO ATIVADAS                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Digite 'dev.help()' no console para ver os comandos          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  }

  /**
   * Executa o seed do banco de dados (apenas se estiver vazio)
   */
  private static async runSeed(): Promise<void> {
    try {
      const seeder = this.appRef.injector.get(DatabaseSeeder);
      await seeder.seed();
      console.log('✅ Seed executado com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('❌ Erro ao executar seed:', error);
    }
  }

  /**
   * Força o seed mesmo se já existirem dados
   */
  private static async runForceSeed(): Promise<void> {
    const confirm = window.confirm(
      '⚠️ Isso irá adicionar os dados de seed mesmo se já existirem dados no banco.\n\n' +
      'Deseja continuar?'
    );

    if (!confirm) {
      console.log('❌ Operação cancelada');
      return;
    }

    try {
      const seeder = this.appRef.injector.get(DatabaseSeeder);
      await seeder.forceSeed();
      console.log('✅ Force seed executado com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('❌ Erro ao executar force seed:', error);
    }
  }

  /**
   * Limpa todos os dados do banco
   */
  private static async clearDatabase(): Promise<void> {
    const confirm = window.confirm(
      '⚠️ ATENÇÃO: Isso irá DELETAR TODOS OS DADOS do banco!\n\n' +
      'Esta ação não pode ser desfeita.\n\n' +
      'Deseja continuar?'
    );

    if (!confirm) {
      console.log('❌ Operação cancelada');
      return;
    }

    try {
      const clearUseCase = this.appRef.injector.get(ClearAllActivitiesUseCase);
      await clearUseCase.execute();
      console.log('✅ Banco de dados limpo com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('❌ Erro ao limpar banco:', error);
    }
  }

  /**
   * Mostra a ajuda com os comandos disponíveis
   */
  private static showHelp(): void {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🛠️  COMANDOS DE DESENVOLVIMENTO DISPONÍVEIS                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  dev.seed()                                                    ║
║  └─ Popula o banco com dados iniciais (apenas se vazio)       ║
║                                                                ║
║  dev.forceSeed()                                               ║
║  └─ Adiciona dados de seed mesmo se já existirem dados        ║
║                                                                ║
║  dev.clearDatabase()                                           ║
║  └─ ⚠️  DELETA TODOS OS DADOS do banco                         ║
║                                                                ║
║  dev.help()                                                    ║
║  └─ Mostra esta mensagem de ajuda                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📊 DADOS DO SEED:
   • 33 eventos de grupos
   • Período: Nov/2025 a Dez/2026
   • Grupos de diversas cidades do RS
    `);
  }
}
