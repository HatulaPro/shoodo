import type { AuthResponse, Session } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { supabase } from './client';
import type { definitions } from './types';

export type PublicUser = definitions['users'];

export async function getSession(): Promise<Session | null> {
	const session = await supabase.auth.getSession();
	if (session.error) return null;
	return session.data?.session;
}

export async function logOut() {
	await supabase.auth.signOut();
}

export async function signInWithEmail(email: string): Promise<AuthResponse> {
	return await supabase.auth.signInWithOtp({
		email: email,
		options: { emailRedirectTo: `${document.location.origin}/auth/loading` },
	});
}

export function getUserFromJWT(token: string | undefined): PublicUser {
	const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
	if (!SUPABASE_JWT_SECRET) throw new Error('Missing JWT token');
	if (!token) throw new Error('Invalid token');
	token = token.substring(7);
	const decoded = jwt.verify(token, SUPABASE_JWT_SECRET!) as { sub: string; email: string };
	return { id: decoded.sub, email: decoded.email! };
}
