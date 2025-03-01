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

const initialCategories = [
  { categoryName: 'Sales', userIds: [] },
  { categoryName: 'Business', userIds: [] },
  { categoryName: 'Technology', userIds: [] },
  { categoryName: 'HR', userIds: [] },
];

async function main() {
  console.log('Starting to seed data...');

  // Seed data sources
  console.log('Seeding data sources...');
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

  // Seed categories
  console.log('\nSeeding categories...');
  for (const category of initialCategories) {
    try {
      const normalizedName = category.categoryName.trim();
      
      // Try to create the category
      const newCategory = await prisma.category.create({
        data: {
          categoryName: normalizedName,
          userIds: []
        }
      });
      console.log(`Created category: ${newCategory.categoryName}`);
    } catch (error: any) {
      // If category already exists (unique constraint violation), just log it
      if (error.code === 'P2002') {
        console.log(`Category already exists: ${category.categoryName}`);
        continue;
      }
      // For other errors, throw them
      throw error;
    }
  }

  console.log('\nSeeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
