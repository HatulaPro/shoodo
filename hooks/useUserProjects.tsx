import type { User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from 'react-query';
import type { Project } from '../utils/supabase/projects';
import { getUserProjects } from '../utils/supabase/projects';

export function useUserProjects(user: User | null) {
	const queryClient = useQueryClient();

	const { isLoading, data, refetch } = useQuery(
		['projects', user?.id],
		async () => {
			// No new projects, so we can use the prefetched data;
			return await getUserProjects(user!.id);
		},
		{
			refetchOnWindowFocus: false,
			placeholderData: [],
			enabled: user !== null,
			staleTime: 60 * 1000,
		}
	);

	function manualUpdate(newProjects: Project[]) {
		queryClient.setQueryData(['projects', user?.id], () => newProjects);
	}

	return { isLoading, data, refetch, manualUpdate };
}
