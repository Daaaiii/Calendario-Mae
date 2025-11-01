import { Injectable, inject } from '@angular/core';
import { Activity } from '../../core/domain/entities/activity.entity';
import { ActivityRepository } from '../../core/domain/repositories/activity.repository';
import { SqliteDatabaseService } from '../database/sqlite-database.service';

/**
 * Implementação do repositório usando SQLite
 *
 * Segue o princípio de Inversão de Dependência (D do SOLID):
 * Implementa a interface definida no domínio.
 */
@Injectable({
  providedIn: 'root'
})
export class SqliteActivityRepository extends ActivityRepository {
  private db = inject(SqliteDatabaseService);

  async findAll(): Promise<Activity[]> {
    const rows = await this.db.executeQuery(
      'SELECT id, date, title, description FROM activities ORDER BY date, id'
    );

    return rows.map(row => Activity.fromPersistence({
      id: row[0] as number,
      date: row[1] as string,
      title: row[2] as string,
      description: row[3] as string
    }));
  }

  async findByDate(date: string): Promise<Activity[]> {
    const rows = await this.db.executeQuery(
      'SELECT id, date, title, description FROM activities WHERE date = ? ORDER BY id',
      [date]
    );

    return rows.map(row => Activity.fromPersistence({
      id: row[0] as number,
      date: row[1] as string,
      title: row[2] as string,
      description: row[3] as string
    }));
  }

  async findById(id: number): Promise<Activity | null> {
    const rows = await this.db.executeQuery(
      'SELECT id, date, title, description FROM activities WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return Activity.fromPersistence({
      id: row[0] as number,
      date: row[1] as string,
      title: row[2] as string,
      description: row[3] as string
    });
  }

  async save(activity: Activity): Promise<Activity> {
    const data = activity.toPersistence();

    if (activity.isNew()) {
      // INSERT
      await this.db.executeCommand(
        'INSERT INTO activities (date, title, description) VALUES (?, ?, ?)',
        [data.date, data.title, data.description]
      );

      const newId = await this.db.getLastInsertId();

      return Activity.fromPersistence({
        id: newId,
        date: data.date,
        title: data.title,
        description: data.description
      });
    } else {
      // UPDATE
      await this.db.executeCommand(
        'UPDATE activities SET date = ?, title = ?, description = ? WHERE id = ?',
        [data.date, data.title, data.description, data.id]
      );

      return activity;
    }
  }

  async delete(id: number): Promise<void> {
    await this.db.executeCommand(
      'DELETE FROM activities WHERE id = ?',
      [id]
    );
  }

  async deleteAll(): Promise<void> {
    await this.db.executeCommand('DELETE FROM activities');
  }
}
