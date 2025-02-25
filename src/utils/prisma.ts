import { PrismaClient } from '@prisma/client';

// Initialize Prisma with logging to debug issues
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Connect to the database
prisma.$connect()
  .then(() => console.log('Successfully connected to the database'))
  .catch((e) => console.error('Failed to connect to the database:', e));

// Handle cleanup on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
