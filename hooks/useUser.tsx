import { getUser } from '../utils/supabase/auth';
import { supabase } from '../utils/supabase/client';
import { useEffect } from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useQuery } from 'react-query';

let prevEvent: AuthChangeEvent | null = null;
export function useUser(): { user: User | null; isLoading: boolean } {
	const { data: user, refetch, isLoading } = useQuery('user', getUser);

	useEffect(() => {
		const listener = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
			console.log({ event, prevEvent });
			if (event !== prevEvent) {
				fetch('/api/setCookie', {
					method: 'POST',
					headers: new Headers({ 'Content-Type': 'application/json' }),
					credentials: 'same-origin',
					body: JSON.stringify({ event, session }),
				}).then(() => refetch());
			}
			prevEvent = event;
		});
		return () => {
			listener.data?.unsubscribe();
		};
	}, [user, refetch]);

	return { user: user || null, isLoading };
}
