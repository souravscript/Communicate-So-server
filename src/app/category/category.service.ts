import { prisma } from '../../utils/prisma';

export const createCategory = async (categoryName: string) => {
  try {
    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } }
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name: categoryName,
      }
    });

    return category;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create category');
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch category');
  }
};
