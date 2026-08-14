import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase client instance.
 * Uses the anon key for public read/write access governed by RLS policies.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
