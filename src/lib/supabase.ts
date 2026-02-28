import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets.");
    // Return a proxy or handle gracefully. For now, we'll try to create it but it might still fail if called.
    // Better to throw a clear error when used, or return null and handle in components.
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Use getSupabase() to access the client safely
