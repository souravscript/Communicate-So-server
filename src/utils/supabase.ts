import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not defined in environment variables');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined in environment variables');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Create Supabase client with retries and timeout
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'x-application-name': 'communicate.so'
    }
  },
  // Add retry configuration
  db: {
    schema: 'public'
  }
});
