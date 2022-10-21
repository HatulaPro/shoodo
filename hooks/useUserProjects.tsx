import type { User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from 'react-query';
import { Project } from '../utils/supabase/projects';

type UserProjectsResult<B extends Project> = {
	isLoading: boolean;
	data: B[] | undefined;
	refetch: () => void;
	manualUpdate: (newProjects: B[]) => void;
};

export function useUserProjects<B extends Project>(user: User | null, func: (userId: string) => Promise<B[]>): UserProjectsResult<B> {
	const queryClient = useQueryClient();

	const { isLoading, data, refetch } = useQuery(
		['projects', user?.id, func],
		() => {
			// No new projects, so we can use the prefetched data;
			return func(user!.id);
		},
		{
			refetchOnWindowFocus: false,
			placeholderData: [],
			enabled: user !== null,
			staleTime: 60 * 1000,
		}
	);

	function manualUpdate(newProjects: B[]) {
		queryClient.setQueryData(['projects', user?.id, func], () => newProjects);
	}

	return { isLoading, data, refetch, manualUpdate };
}
