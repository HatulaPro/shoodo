import { supabase } from './client';
import { User, ApiError } from '@supabase/supabase-js';

export function getUser(): User | null {
	return supabase.auth.user();
}

interface UserOrError {
	user: User | null;
	error: ApiError | null;
}

export async function signInWithEmail(email: string): Promise<UserOrError> {
	const { user, error } = await supabase.auth.signIn({
		email: email,
	});

	return { user, error };
}
