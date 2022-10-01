import { getUser } from '../utils/supabase/auth';
import { supabase } from '../utils/supabase/client';
import { useEffect } from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useQuery } from 'react-query';

export function useUser(): User | null {
	const { data: user, refetch } = useQuery('user', getUser);

	useEffect(() => {
		const listener = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
			fetch('/api/setCookie', {
				method: 'POST',
				headers: new Headers({ 'Content-Type': 'application/json' }),
				credentials: 'same-origin',
				body: JSON.stringify({ event, session }),
			}).then(() => refetch());
		});
		return () => {
			listener.data?.unsubscribe();
		};
	}, [user, refetch]);

	return user || null;
}
