import { prisma } from '../../../utils/prisma';

interface CreateMemberInput {
  name: string;
  email: string;
  categoryName: string;
}

export const createMember = async (input: CreateMemberInput) => {
  try {
    const { name, email, categoryName } = input;

    const existingMember=await prisma.user.findUnique({
      where: { email: email }
    } )
    if(existingMember){
      throw new Error('Member with this email already exists');
    }
    // Check if category exists
    const category = await prisma.category.findFirst({
      where: { categoryName: categoryName }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Create user with category relation
    const member = await prisma.user.create({
      data: {
        name,
        categories: {
          connect: [{ id: category.id }]
        },
        email: `${name.toLowerCase().replace(/\s+/g, '.')}_${Date.now()}@temp.com`,
        supabaseId: `temp_${Date.now()}`,
        lastLogin: new Date()
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
    // Get all users with basic info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        supabaseId: true,
        authType: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get categories for each user
    const usersWithCategories = await Promise.all(
      users.map(async (user) => {
        const categories = await prisma.category.findMany({
          where: {
            userIds: {
              has: user.id
            }
          },
          select: {
            id: true,
            categoryName: true
          }
        });
        return {
          ...user,
          categories
        };
      })
    );

    return usersWithCategories;
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

export const deleteMember = async (id: string) => {
  try {
    // Check if member exists
    const existingMember = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingMember) {
      throw new Error('Member not found');
    }

    // Delete the member
    const deletedMember = await prisma.user.delete({
      where: { id },
      include: {
        categories: true
      }
    });

    return deletedMember;
  } catch (error) {
    console.error('Error in deleteMember:', error);
    throw error;
  }
};
