import { Injectable } from '@angular/core';
import type { Database } from 'sql.js';

// Declaração global para o sql.js carregado via CDN
declare global {
  interface Window {
    initSqlJs: any;
  }
}

/**
 * Serviço de banco de dados SQLite
 *
 * Responsável apenas pela inicialização e operações básicas do SQLite.
 * Segue o princípio de Responsabilidade Única (S do SOLID).
 */
@Injectable({
  providedIn: 'root'
})
export class SqliteDatabaseService {
  private db: Database | null = null;
  private initPromise: Promise<void>;
  private readonly DB_KEY = 'calendario_db';
  private readonly DB_VERSION = '6'; // Novo usuário Cledi adicionado
  private readonly DB_VERSION_KEY = 'calendario_db_version';

  constructor() {
    this.initPromise = this.initialize();
  }

  /**
   * Inicializa o banco de dados
   */
  private async initialize(): Promise<void> {
    try {
      // Aguarda o sql.js estar disponível
      if (typeof window.initSqlJs === 'undefined') {
        await new Promise((resolve) => {
          const checkSqlJs = setInterval(() => {
            if (typeof window.initSqlJs !== 'undefined') {
              clearInterval(checkSqlJs);
              resolve(true);
            }
          }, 100);
        });
      }

      const SQL = await window.initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });

      const currentVersion = localStorage.getItem(this.DB_VERSION_KEY);
      const savedDb = localStorage.getItem(this.DB_KEY);

      // Se a versão mudou, limpa o banco antigo
      if (currentVersion !== this.DB_VERSION && savedDb) {
        console.log('🔄 Nova versão do schema detectada, recriando banco...');
        localStorage.removeItem(this.DB_KEY);
        localStorage.setItem(this.DB_VERSION_KEY, this.DB_VERSION);
      }

      if (savedDb && currentVersion === this.DB_VERSION) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new SQL.Database(uint8Array);
        console.log('✅ Banco de dados carregado');
      } else {
        this.db = new SQL.Database();
        this.createSchema();
        localStorage.setItem(this.DB_VERSION_KEY, this.DB_VERSION);
        console.log('✅ Novo banco de dados criado');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  /**
   * Cria o schema do banco de dados
   */
  private createSchema(): void {
    if (!this.db) return;

    const schema = `
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_date ON activities(date);

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    this.db.run(schema);

    // Verifica a estrutura criada
    const tableInfo = this.db.exec('PRAGMA table_info(activities)');
    console.log('📋 Estrutura da tabela activities:', tableInfo);

    // Verifica se existe sqlite_sequence
    const seqCheck = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'");
    console.log('🔢 Tabela sqlite_sequence existe:', seqCheck.length > 0);

    this.persist();
  }  /**
   * Aguarda a inicialização do banco
   */
  async waitForInit(): Promise<void> {
    await this.initPromise;
  }

  /**
   * Executa uma query SELECT
   */
  async executeQuery(sql: string, params: any[] = []): Promise<any[]> {
    await this.waitForInit();

    if (!this.db) {
      throw new Error('Banco de dados não inicializado');
    }

    const results = this.db.exec(sql, params);

    if (results.length === 0) {
      return [];
    }

    return results[0].values;
  }

  /**
   * Executa um comando (INSERT, UPDATE, DELETE)
   */
  async executeCommand(sql: string, params: any[] = []): Promise<void> {
    await this.waitForInit();

    if (!this.db) {
      throw new Error('Banco de dados não inicializado');
    }

    this.db.run(sql, params);
    this.persist();
  }

  /**
   * Obtém o ID da última inserção
   */
  async getLastInsertId(): Promise<number> {
    await this.waitForInit();

    if (!this.db) {
      throw new Error('Banco de dados não inicializado');
    }

    // Tenta primeiro o método padrão
    let results = this.db.exec('SELECT last_insert_rowid() as id');
    let id = results[0]?.values[0]?.[0] as number;

    // Se retornar 0, busca o MAX(id) da tabela (fallback para sql.js)
    if (id === 0 || id === undefined || id === null) {
      results = this.db.exec('SELECT MAX(id) as maxId FROM activities');
      id = results[0]?.values[0]?.[0] as number;

      // Se ainda for null/undefined, retorna 1 (primeira inserção)
      if (id === null || id === undefined) {
        id = 1;
      }
    }

    return id;
  }  /**
   * Persiste o banco no localStorage
   */
  private persist(): void {
    if (!this.db) return;

    try {
      const data = this.db.export();
      const dataString = JSON.stringify(Array.from(data));
      localStorage.setItem(this.DB_KEY, dataString);
    } catch (error) {
      console.error('❌ Erro ao persistir banco de dados:', error);
    }
  }

  /**
   * Debug: Lista todas as atividades no banco
   */
  async debugListActivities(): Promise<void> {
    await this.waitForInit();

    if (!this.db) {
      console.error('❌ Banco não inicializado');
      return;
    }

    console.log('🔍 === DEBUG: Conteúdo do banco ===');

    const results = this.db.exec('SELECT * FROM activities ORDER BY id');

    if (results.length === 0 || results[0].values.length === 0) {
      console.log('📭 Nenhuma atividade encontrada no banco');
    } else {
      console.table(results[0].values.map(row => ({
        id: row[0],
        date: row[1],
        title: row[2],
        description: row[3]
      })));
    }

    console.log('🔍 === Fim do debug ===');
  }
}
