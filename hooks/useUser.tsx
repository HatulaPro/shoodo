import { getUser } from '../utils/supabase/auth';
import { supabase } from '../utils/supabase/client';
import { useEffect } from 'react';
import { AuthChangeEvent, User } from '@supabase/supabase-js';
import { useQuery } from 'react-query';

let isFirstRun = true;

export function useUser(): User | null {
	const { data: user, refetch } = useQuery('user', getUser);

	useEffect(() => {
		if (isFirstRun) {
			isFirstRun = false;
			const listener = supabase.auth.onAuthStateChange(() => {
				refetch();
			});
			return () => {
				listener.data?.unsubscribe();
			};
		}
	}, [user, refetch]);

	return user || null;
}
