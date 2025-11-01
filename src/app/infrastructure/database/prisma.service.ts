import { Injectable } from '@angular/core';
import { PrismaClient } from '../../../generated/prisma/client';


/**
 * Serviço Prisma - Singleton para gerenciar a conexão com o banco
 */
@Injectable({
  providedIn: 'root'
})
export class PrismaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'file:./prisma/dev.db'
        }
      }
    });
  }

  get activity() {
    return this.prisma.activity;
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
