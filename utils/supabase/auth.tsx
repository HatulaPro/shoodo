import { supabase } from './client';
import { User, ApiError } from '@supabase/supabase-js';

export function getUser(): User | null {
	return supabase.auth.user();
}

export async function signInWithEmail(email: string): Promise<User | ApiError> {
	const { user, error } = await supabase.auth.signIn({
		email: email,
	});

	return user || error!;
}
