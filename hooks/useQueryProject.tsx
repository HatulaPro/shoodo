import { User } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Column, createColumn, deleteColumn, getProjectById, Project, updateColumnById } from '../utils/supabase/projects';
import { useRouter } from 'next/router';

export type ColumnMutateArgs =
	| {
			type: 'UPDATE';
			column_id: number;
			update: Partial<Column>;
	  }
	| {
			type: 'CREATE';
	  }
	| {
			type: 'DELETE';
			column_id: number;
	  };

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

	// const { isLoading, mutate: mutateColumn } = useMutation(async (args: ColumnMutateArgs) => {
	const columnsMutation = useMutation(async (args: ColumnMutateArgs) => {
		if (args.type === 'CREATE') {
			const bestImportance = Math.min(...data!.columns!.map((column) => column.importance));
			const col = await createColumn(data!.id, bestImportance - Math.pow(2, 32));
			data!.columns = [col, ...data!.columns!];
			manualUpdate(data!);
		} else if (args.type === 'UPDATE') {
			const col = await updateColumnById(args.column_id!, args.update);
			const index = data!.columns!.findIndex((col_1) => col_1.id === col.id);
			data!.columns![index] = col;
			data!.columns = [...data!.columns!];
			manualUpdate(data!);
		} else if (args.type === 'DELETE') {
			data!.columns = data!.columns!.filter((col) => col.id !== args.column_id);
			deleteColumn(args.column_id);
			manualUpdate(data!);
		}
	});

	return { isLoading: isLoading || columnsMutation.isLoading, data, refetch, manualUpdate, columnsMutation };
}
