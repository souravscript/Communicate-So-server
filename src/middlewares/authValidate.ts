import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { supabase } from '../utils/supabase';
import { UserRole } from '@prisma/client';

// Define the expected structure of the decoded JWT payload
interface DecodedToken {
  sub: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: UserRole | null;
      }
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the access token from cookies
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      // First try to verify the access token
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      
      if (user) {
        // Find user in our database using supabaseId
        const dbUser = await prisma.user.findUnique({
          where: { supabaseId: user.id },
          select: {
            id: true,
            email: true,
            role: true
          }
        });

        if (!dbUser) {
          return res.status(401).json({ message: 'User not found in database' });
        }

        // Token is valid, attach user to request
        req.user = {
          id: dbUser.id, // Use our database ID
          email: dbUser.email,
          role: dbUser.role
        };
        return next();
      }
    } catch (error) {
      // Access token verification failed, try refresh token
      if (refreshToken) {
        const { data: { session }, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        });

        if (error) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }

        if (session?.user) {
          // Find user in our database using supabaseId
          const dbUser = await prisma.user.findUnique({
            where: { supabaseId: session.user.id },
            select: {
              id: true,
              email: true,
              role: true
            }
          });

          if (!dbUser) {
            return res.status(401).json({ message: 'User not found in database' });
          }

          // Set new cookies
          res.cookie('access_token', session.access_token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          res.cookie('refresh_token', session.refresh_token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
          });

          // Attach user to request
          req.user = {
            id: dbUser.id, // Use our database ID
            email: dbUser.email,
            role: dbUser.role
          };
          return next();
        }
      }
    }

    return res.status(401).json({ message: 'Invalid token' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
