import { prisma } from '../../src/data/prisma.connection';

describe('Prisma Connection', () => {
  it('should be a singleton', () => {
    const prisma1 = prisma;
    const prisma2 = prisma;

    expect(prisma1).toBe(prisma2);
  });

  it('should be able to connect to the database', async () => {
    const users = await prisma.user.findMany();

    expect(users).toBeDefined();
  });

  it('should be able to disconnect from the database', async () => {
    await prisma.$disconnect();
  });
});
