import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (typeof supabaseUrl !== 'string' || typeof supabaseAnonKey !== 'string') throw new Error('No API key provided.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	realtime: {
		params: {
			// @ts-ignore
			eventsPerSecond: 2,
		},
	},
});

export const getServiceSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
