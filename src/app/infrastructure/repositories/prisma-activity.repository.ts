import { Injectable, inject } from '@angular/core';
import { ActivityRepository } from '../../core/domain/repositories/activity.repository';
import { Activity } from '../../core/domain/entities/activity.entity';
import { PrismaService } from '../database/prisma.service';

/**
 * Implementação do repositório usando Prisma + SQLite
 */
@Injectable({
  providedIn: 'root'
})
export class PrismaActivityRepository implements ActivityRepository {
  private prisma = inject(PrismaService);

  async findAll(): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      orderBy: { date: 'asc' }
    });

    return activities.map(a => Activity.fromPersistence({
      id: a.id,
      date: a.date,
      title: a.title,
      description: a.description || ''
    }));
  }

  async findById(id: number): Promise<Activity | null> {
    const activity = await this.prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) return null;

    return Activity.fromPersistence({
      id: activity.id,
      date: activity.date,
      title: activity.title,
      description: activity.description || ''
    });
  }

  async findByDate(date: string): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { date },
      orderBy: { createdAt: 'asc' }
    });

    return activities.map(a => Activity.fromPersistence({
      id: a.id,
      date: a.date,
      title: a.title,
      description: a.description || ''
    }));
  }

  async save(activity: Activity): Promise<Activity> {
    if (activity.id !== undefined) {
      // Update
      const updated = await this.prisma.activity.update({
        where: { id: activity.id },
        data: {
          date: activity.date,
          title: activity.title,
          description: activity.description
        }
      });

      return Activity.fromPersistence({
        id: updated.id,
        date: updated.date,
        title: updated.title,
        description: updated.description || ''
      });
    } else {
      // Create
      const created = await this.prisma.activity.create({
        data: {
          date: activity.date,
          title: activity.title,
          description: activity.description || ''
        }
      });

      return Activity.fromPersistence({
        id: created.id,
        date: created.date,
        title: created.title,
        description: created.description || ''
      });
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.activity.delete({
      where: { id }
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.activity.deleteMany();
  }
}
