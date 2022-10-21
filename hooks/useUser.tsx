import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getSession } from '../utils/supabase/auth';
import { supabase } from '../utils/supabase/client';

type UseUserOptions = { authOnly?: boolean };
let prevEvent: AuthChangeEvent | null = null;
export function useUser(options?: UseUserOptions): { user: User | null; access_token: string | null; isLoading: boolean } {
	const router = useRouter();
	const { data: session, refetch, isLoading } = useQuery('user', getSession);

	useEffect(() => {
		if (!session && !isLoading && options?.authOnly) {
			router.push('/');
		}
		const listener = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
			if (event !== prevEvent) {
				refetch();
			}
			prevEvent = event;
		});
		return () => {
			listener.data.subscription?.unsubscribe();
		};
	}, [session, refetch, router]);

	return { user: session?.user || null, access_token: session?.access_token || null, isLoading };
}
