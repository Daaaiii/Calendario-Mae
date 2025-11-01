import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

export interface Activity {
  id?: number;
  date: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | null = null;
  private isInitialized = false;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    try {
      // Inicializa o SQL.js
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });

      // Tenta carregar o banco de dados do localStorage
      const savedDb = localStorage.getItem('calendario_db');

      if (savedDb) {
        // Carrega banco existente
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new SQL.Database(uint8Array);
        console.log('Banco de dados carregado do localStorage');
      } else {
        // Cria novo banco de dados
        this.db = new SQL.Database();
        this.createTables();
        console.log('Novo banco de dados criado');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
  }

  private createTables(): void {
    if (!this.db) return;

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_date ON activities(date);
    `;

    this.db.run(createTableSQL);
    this.saveDatabase();
  }

  private saveDatabase(): void {
    if (!this.db) return;

    try {
      const data = this.db.export();
      const buffer = Array.from(data);
      localStorage.setItem('calendario_db', JSON.stringify(buffer));
    } catch (error) {
      console.error('Erro ao salvar banco de dados:', error);
    }
  }

  async waitForInit(): Promise<void> {
    while (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async getAllActivities(): Promise<Activity[]> {
    await this.waitForInit();
    if (!this.db) return [];

    try {
      const results = this.db.exec('SELECT * FROM activities ORDER BY date');

      if (results.length === 0) return [];

      const activities: Activity[] = [];
      const columns = results[0].columns;
      const values = results[0].values;

      for (const row of values) {
        activities.push({
          id: row[0] as number,
          date: row[1] as string,
          title: row[2] as string,
          description: row[3] as string
        });
      }

      return activities;
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      return [];
    }
  }

  async getActivitiesByDate(date: string): Promise<Activity[]> {
    await this.waitForInit();
    if (!this.db) return [];

    try {
      const results = this.db.exec(
        'SELECT * FROM activities WHERE date = ? ORDER BY id',
        [date]
      );

      if (results.length === 0) {
        return [];
      }

      const activities: Activity[] = [];
      for (const row of results[0].values) {
        activities.push({
          id: row[0] as number,
          date: row[1] as string,
          title: row[2] as string,
          description: row[3] as string
        });
      }

      return activities;
    } catch (error) {
      console.error('Erro ao buscar atividades por data:', error);
      return [];
    }
  }

  async getActivityById(id: number): Promise<Activity | undefined> {
    await this.waitForInit();
    if (!this.db) return undefined;

    try {
      const results = this.db.exec(
        'SELECT * FROM activities WHERE id = ?',
        [id]
      );

      if (results.length === 0 || results[0].values.length === 0) {
        return undefined;
      }

      const row = results[0].values[0];
      return {
        id: row[0] as number,
        date: row[1] as string,
        title: row[2] as string,
        description: row[3] as string
      };
    } catch (error) {
      console.error('Erro ao buscar atividade por ID:', error);
      return undefined;
    }
  }

  async getActivityByDate(date: string): Promise<Activity | undefined> {
    await this.waitForInit();
    if (!this.db) return undefined;

    try {
      const results = this.db.exec(
        'SELECT * FROM activities WHERE date = ? LIMIT 1',
        [date]
      );

      if (results.length === 0 || results[0].values.length === 0) {
        return undefined;
      }

      const row = results[0].values[0];
      return {
        id: row[0] as number,
        date: row[1] as string,
        title: row[2] as string,
        description: row[3] as string
      };
    } catch (error) {
      console.error('Erro ao buscar atividade por data:', error);
      return undefined;
    }
  }

  async saveActivity(activity: Activity): Promise<Activity> {
    await this.waitForInit();
    if (!this.db) throw new Error('Banco de dados não inicializado');

    try {
      if (activity.id) {
        // Atualiza atividade existente
        this.db.run(
          'UPDATE activities SET date = ?, title = ?, description = ? WHERE id = ?',
          [activity.date, activity.title, activity.description, activity.id]
        );
        this.saveDatabase();
        return activity;
      } else {
        // Insere nova atividade
        this.db.run(
          'INSERT INTO activities (date, title, description) VALUES (?, ?, ?)',
          [activity.date, activity.title, activity.description]
        );

        // Pega o ID da última inserção
        const results = this.db.exec('SELECT last_insert_rowid() as id');
        const newId = results[0].values[0][0] as number;

        this.saveDatabase();
        return { ...activity, id: newId };
      }
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      throw error;
    }
  }

  async deleteActivity(id: number): Promise<boolean> {
    await this.waitForInit();
    if (!this.db) return false;

    try {
      this.db.run('DELETE FROM activities WHERE id = ?', [id]);
      this.saveDatabase();
      return true;
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    await this.waitForInit();
    if (!this.db) return;

    try {
      this.db.run('DELETE FROM activities');
      this.saveDatabase();
      console.log('Todos os dados foram limpos');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
}
