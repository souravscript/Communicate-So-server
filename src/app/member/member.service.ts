import { prisma } from '../../utils/prisma';
import { UserRole } from '@prisma/client';

export const createMember = async (
  name: string,
  categoryName: string,
  //role: UserRole = UserRole.Employee // Default role is Employee
) => {
  try {
    // Find the category by name
    const category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      throw new Error(`Category "${categoryName}" not found`);
    }

    // Create the member with the category
    const member = await prisma.user.create({
      data: {
        name,
        //role,
        categoryIds: [category.id],
        // Generate a temporary email until actual auth is set up
        email: `${name.toLowerCase().replace(/\s+/g, '.')}_${Date.now()}@temp.com`,
        supabaseId: `temp_${Date.now()}` // Temporary ID until actual auth is set up
      },
      include: {
        categories: true
      }
    });

    return member;
  } catch (error) {
    console.error('Error in createMember:', error);
    throw error;
  }
};

export const getAllMembers = async () => {
  try {
    return await prisma.user.findMany({
      include: {
        categories: true
      }
    });
  } catch (error) {
    console.error('Error in getAllMembers:', error);
    throw error;
  }
};

export const getMemberById = async (id: string) => {
  try {
    const member = await prisma.user.findUnique({
      where: { id },
      include: {
        categories: true
      }
    });

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  } catch (error) {
    console.error('Error in getMemberById:', error);
    throw error;
  }
};
