import type { ApiError, User } from '@supabase/supabase-js';
import { supabase } from './client';

export type PublicUser = {
	email: string;
	id: string;
};

export function getUser(): User | null {
	return supabase.auth.user();
}

export async function logOut() {
	await supabase.auth.signOut();
}

interface UserOrError {
	user: User | null;
	error: ApiError | null;
}

export async function signInWithEmail(email: string): Promise<UserOrError> {
	const { user, error } = await supabase.auth.signIn(
		{
			email: email,
		},
		{ redirectTo: `${document.location.origin}/auth/loading` }
	);

	return { user, error };
}
