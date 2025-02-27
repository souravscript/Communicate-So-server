import { UserRole, AuthType } from '@prisma/client';
import { supabase } from '../../../utils/supabase';
import { prisma } from '../../../utils/prisma';
import { Response } from 'express';

export const signupUser = async (email: string, password: string, fullName: string) => {
  try {
    console.log('Starting signup process...', { email, fullName });

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create Supabase user
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log('Supabase response:', data);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: email,
        supabaseId: data.user?.id || '',
        authType: AuthType.EMAIL,
        role: UserRole.Employee // Default role
      }
    });

    return {
      user,
      message: 'User created successfully'
    };

  } catch (error) {
    console.error('Error in signupUser:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create user');
  }
};

export const signinUser = async (email: string, password: string, res: Response) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Supabase signin error:', error);
      throw new Error(error.message);
    }

    if (!data?.session) {
      throw new Error('No session data received from Supabase');
    }

    const supabaseId = data.session.user.id;
    const { access_token, refresh_token } = data.session;

    // Get user from our database
    const authUser = await prisma.user.findUnique({
      where: { supabaseId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        categoryIds: true,
      }
    });

    if (!authUser) {
      throw new Error('User not found in database');
    }

    // Set Cookies
    const accessTokenOptions = {
      httpOnly: false,
      secure: false,  // Set to false for localhost
      sameSite: 'lax' as const,  // Changed to lax for local development
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const refreshTokenOptions = {
      httpOnly: false,
      secure: false,  // Set to false for localhost
      sameSite: 'lax' as const,  // Changed to lax for local development
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    // Set cookies using res.cookie instead of headers
    res.cookie('access_token', data.session?.access_token || '', accessTokenOptions);
    res.cookie('refresh_token', data.session?.refresh_token || '', refreshTokenOptions);

    return {
      user: authUser,
      session: data.session
    };

  } catch (error) {
    console.error('Error in signinUser:', error);
    throw error;
  }
};

export const logoutUser = async (res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);

    // Clear cookies with same options
    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none' as const,
      path: '/',
      domain: 'localhost',
      maxAge: 0  // Expire immediately
    };

    // Clear cookies using res.cookie
    res.cookie('access_token', '', cookieOptions);
    res.cookie('refresh_token', '', cookieOptions);

    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
