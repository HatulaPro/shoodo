import type { User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from 'react-query';
import { getUserInvites, getUserProjects, Project } from '../utils/supabase/projects';

export function useUserProjects(user: User | null, invited: boolean) {
	const queryClient = useQueryClient();

	const { isLoading, data, refetch } = useQuery(
		['projects', user?.id, invited],
		() => {
			// No new projects, so we can use the prefetched data;
			return invited ? getUserInvites(user!.id) : getUserProjects(user!.id);
		},
		{
			refetchOnWindowFocus: false,
			placeholderData: [],
			enabled: user !== null,
			staleTime: 60 * 1000,
		}
	);

	function manualUpdate(newProjects: Project[]) {
		queryClient.setQueryData(['projects', user?.id, invited], () => newProjects);
	}

	return { isLoading, data, refetch, manualUpdate };
}
