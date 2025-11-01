import { Injectable, inject } from '@angular/core';
import { SaveActivityUseCase } from '../../core/application/use-cases/save-activity.use-case';
import { LoadActivitiesUseCase } from '../../core/application/use-cases/load-activities.use-case';
import { SEED_DATA } from './seed-data';

/**
 * Serviço de Seed para popular o banco de dados
 * 
 * Responsável por inserir dados iniciais no banco de dados.
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseSeeder {
  private saveActivityUseCase = inject(SaveActivityUseCase);
  private loadActivitiesUseCase = inject(LoadActivitiesUseCase);

  /**
   * Executa o seed do banco de dados
   */
  async seed(): Promise<void> {
    try {
      console.log('🌱 Iniciando seed do banco de dados...');

      // Verifica se já existem dados
      const existingActivities = await this.loadActivitiesUseCase.execute();
      
      if (existingActivities.length > 0) {
        console.log('⚠️ Banco de dados já possui dados. Seed cancelado.');
        console.log(`📊 Total de atividades existentes: ${existingActivities.length}`);
        return;
      }

      // Insere os dados do seed
      let successCount = 0;
      let errorCount = 0;

      for (const data of SEED_DATA) {
        try {
          await this.saveActivityUseCase.execute({
            date: data.date,
            title: data.title,
            description: ''
          });
          successCount++;
        } catch (error) {
          console.error(`❌ Erro ao inserir: ${data.title} - ${data.date}`, error);
          errorCount++;
        }
      }

      console.log('✅ Seed concluído!');
      console.log(`📊 Registros inseridos: ${successCount}`);
      if (errorCount > 0) {
        console.log(`⚠️ Erros: ${errorCount}`);
      }
    } catch (error) {
      console.error('❌ Erro ao executar seed:', error);
      throw error;
    }
  }

  /**
   * Verifica se o banco precisa de seed
   */
  async needsSeed(): Promise<boolean> {
    const activities = await this.loadActivitiesUseCase.execute();
    return activities.length === 0;
  }

  /**
   * Força o seed mesmo se já existirem dados (útil para desenvolvimento)
   */
  async forceSeed(): Promise<void> {
    console.log('🔄 Forçando seed do banco de dados...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const data of SEED_DATA) {
      try {
        await this.saveActivityUseCase.execute({
          date: data.date,
          title: data.title,
          description: ''
        });
        successCount++;
      } catch (error) {
        console.error(`❌ Erro ao inserir: ${data.title} - ${data.date}`, error);
        errorCount++;
      }
    }

    console.log('✅ Force seed concluído!');
    console.log(`📊 Registros inseridos: ${successCount}`);
    if (errorCount > 0) {
      console.log(`⚠️ Erros: ${errorCount}`);
    }
  }
}
