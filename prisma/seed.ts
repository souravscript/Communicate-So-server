import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialDataSources = [
  { name: 'google-drive', isEnabled: false },
  { name: 'slack', isEnabled: false },
  { name: 'tally', isEnabled: false },
  { name: 'salesforce', isEnabled: false },
  { name: 'pdf', isEnabled: false },
  { name: 'links', isEnabled: false },
  { name: 'database', isEnabled: false },
];

async function main() {
  console.log('Starting to seed data sources...');

  for (const source of initialDataSources) {
    const existing = await prisma.dataSource.findUnique({
      where: { name: source.name }
    });

    if (!existing) {
      await prisma.dataSource.create({
        data: source
      });
      console.log(`Created data source: ${source.name}`);
    } else {
      console.log(`Data source already exists: ${source.name}`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
