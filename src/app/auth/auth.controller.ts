import { Request, Response } from 'express';
import { signupUser, signinUser, logoutUser } from './auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const result = await signupUser(email, password, fullName);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error during signup' });
    }
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await signinUser(email, password, res);
    return res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error during signin' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const result = await logoutUser(res);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error during logout' });
    }
  }
};
