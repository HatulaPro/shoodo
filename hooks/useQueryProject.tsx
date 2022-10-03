import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from 'react-query';
import { getProjectById, Project } from '../utils/supabase/projects';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

export function useQueryProject(user: User | null) {
	const { query } = useRouter();
	const queryClient = useQueryClient();

	function queryToProject(query: ParsedUrlQuery) {
		return {
			id: parseInt(query.id as string),
			created_at: query.created_at as string,
			name: query.name as string,
			description: query.description as string,
			user_id: query.user_id as string,
		} as Project;
	}

	const { isLoading, data, refetch } = useQuery(
		['project'],
		async () => {
			if (Object.keys(query).length === 5) {
				console.log('from query');
				return queryToProject(query);
			}
			console.log('from god');
			return await getProjectById(parseInt(query.id as string));
		},
		{
			refetchOnWindowFocus: false,
			enabled: user !== null && Boolean(query.id),
		}
	);

	function manualUpdate(newProject: Project) {
		queryClient.setQueryData(['project'], () => newProject);
	}

	return { isLoading, data, refetch, manualUpdate };
}
