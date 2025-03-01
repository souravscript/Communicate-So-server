import { prisma } from '../../../utils/prisma';

interface CreateCategoryInput {
  categoryName: string;
}

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        categoryName: {
          not: ''
        }
      },
      orderBy: {
        categoryName: 'asc'
      }
    });
    
    // Additional safety check to filter out any problematic values
    return categories.filter(cat => cat && cat.categoryName && typeof cat.categoryName === 'string' && cat.categoryName.trim() !== '');
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const createCategory = async (categoryName: string) => {
  try {
    if (!categoryName || categoryName.trim() === '') {
      throw new Error('Category name cannot be empty');
    }

    const normalizedName = categoryName.trim();

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { 
        categoryName: { 
          equals: normalizedName,
          mode: 'insensitive'
        }
      }
    });

    if (existingCategory) {
      console.log('Found existing category:', existingCategory);
      return existingCategory;
    }

    // Create new category
    try {
      const category = await prisma.category.create({
        data: {
          categoryName: normalizedName,
          userIds: []
        }
      });
      console.log('Created new category:', category);
      return category;
    } catch (createError: any) {
      // If creation fails due to unique constraint, return the existing category
      if (createError.code === 'P2002') {
        const category = await prisma.category.findFirst({
          where: { 
            categoryName: normalizedName
          }
        });
        if (category) {
          console.log('Found category after creation attempt:', category);
          return category;
        }
      }
      throw createError;
    }
  } catch (error) {
    console.error('Error in createCategory:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create category');
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
