import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from 'react-query';
import { getUserProjects, Project } from '../utils/supabase/projects';

export function useUserProjects(user: User | null, projects: Project[]) {
	const queryClient = useQueryClient();
	const [mutated, setMutated] = useState<boolean>(false);

	const { isLoading, data, refetch } = useQuery(
		['projects'],
		async () => {
			if (!user) return [] as Project[];
			// No new projects, so we can use the prefetched data;
			if (!mutated) return projects;
			return await getUserProjects(user.id);
		},
		{
			refetchOnWindowFocus: false,
			initialData: projects,
			placeholderData: projects,
		}
	);

	useEffect(() => {
		if (user && !isLoading) {
			refetch();
		}
	}, [user, isLoading]);

	function manualUpdate(newProjects: Project[]) {
		setMutated(true);
		queryClient.setQueryData(['projects'], () => newProjects);
	}

	function refetchProjects() {
		setMutated(true);
		refetch();
	}

	return { isLoading, data, refetch: refetchProjects, manualUpdate };
}
