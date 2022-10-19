import type { ApiError, User } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
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

export function getUserFromJWT(token: string | undefined): PublicUser {
	const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
	if (!SUPABASE_JWT_SECRET) throw new Error('Missing JWT token');
	if (!token) throw new Error('Invalid token');
	const decoded = jwt.verify(token, SUPABASE_JWT_SECRET!) as { sub: string; email: string };
	return { id: decoded.sub, email: decoded.email! };
}
