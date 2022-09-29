import { createClient, SupabaseClient, User, ApiError } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (typeof supabaseUrl !== 'string' || typeof supabaseAnonKey !== 'string') throw new Error('No API key provided.');

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithEmail(email: string): Promise<User | ApiError> {
	const { user, error } = await supabase.auth.signIn({
		email: email,
	});
	console.log({ user, error });

	return user || error!;
}
