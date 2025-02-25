import { supabase } from './supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  return retryOperation(() => supabase.auth.signInWithPassword({ email, password }));
}

export async function signOut() {
  return retryOperation(() => supabase.auth.signOut());
}

export async function signUp(email: string, password: string) {
  return retryOperation(() => supabase.auth.signUp({ email, password }));
}

export async function resetPassword(email: string) {
  return retryOperation(() => supabase.auth.resetPasswordForEmail(email));
}

export async function getSession() {
  return retryOperation(() => supabase.auth.getSession());
}
