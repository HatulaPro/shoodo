import { getUser } from '../utils/supabase/auth';
import { supabase } from '../utils/supabase/client';
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useQuery } from 'react-query';

export function useUser(): User | null {
	const { data: user, refetch } = useQuery('user', getUser);

	useEffect(() => {
		const listener = supabase.auth.onAuthStateChange(() => {
			refetch();
		});
		return () => {
			listener.data?.unsubscribe();
		};
	}, [user, refetch]);

	return user || null;
}
