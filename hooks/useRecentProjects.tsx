import type { User } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { getHistories } from '../utils/supabase/history';

export function useRecentProjects(user: User | null) {
	const { isLoading, data } = useQuery(['histories', user?.id], () => getHistories(5), {
		refetchOnWindowFocus: false,
		enabled: user !== null,
		retry: false,
		placeholderData: [],
		staleTime: 30 * 1000,
	});

	return { isLoading, data };
}
