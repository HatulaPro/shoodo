import { createClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (typeof supabaseUrl !== 'string' || typeof supabaseAnonKey !== 'string') throw new Error('No API key provided.');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getServiceSupabase = () => createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
