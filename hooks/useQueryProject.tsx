import { User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from 'react-query';
import { getProjectById, Project } from '../utils/supabase/projects';
import { useRouter } from 'next/router';

export function useQueryProject(user: User | null) {
	const { query } = useRouter();
	const queryClient = useQueryClient();

	const { isLoading, data, refetch } = useQuery(
		['project'],
		async () => {
			return await getProjectById(parseInt(query.id as string));
		},
		{
			refetchOnWindowFocus: false,
			enabled: user !== null && Boolean(query.id),
			retry: false,
			cacheTime: 0,
		}
	);

	function manualUpdate(newProject: Project) {
		queryClient.setQueryData(['project'], () => newProject);
	}

	return { isLoading, data, refetch, manualUpdate };
}
