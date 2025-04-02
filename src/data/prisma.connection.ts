import { PrismaClient } from '../../generated/prisma';

class PrismaDatabase {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!PrismaDatabase.instance) {
      PrismaDatabase.instance = new PrismaClient();
    }
    return PrismaDatabase.instance;
  }
}

export const prisma = PrismaDatabase.getInstance();
