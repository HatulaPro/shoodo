import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Column, createColumn, createTask, deleteColumn, getProjectById, Project, Task, updateColumnById, updateTaskById } from '../utils/supabase/projects';

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
	  }
	| {
			type: 'ADD_TASK';
			column_id: number;
			content: string;
	  }
	| {
			type: 'UPDATE_TASK';
			task_id: number;
			update: Partial<Task>;
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

	const columnsMutation = useMutation(async (args: ColumnMutateArgs) => {
		if (args.type === 'CREATE') {
			const bestImportance = data!.columns!.length ? Math.min(...data!.columns!.map((column) => column.importance)) : Math.pow(2, 33);
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
		} else if (args.type === 'ADD_TASK') {
			const col = data!.columns!.find((col) => col.id === args.column_id)!;
			if (!col.tasks) {
				col.tasks = [];
			}

			const bestImportance = col.tasks.length ? Math.min(...col.tasks.map((task) => task.importance)) : Math.pow(2, 33);
			const task = await createTask(data!.id, col.id, args.content, bestImportance - Math.pow(2, 32));
			col.tasks = [task, ...col.tasks];

			manualUpdate(data!);
		} else if (args.type === 'UPDATE_TASK') {
			const task = await updateTaskById(args.task_id, args.update);
			const taskColumn = data!.columns!.find((col) => col.id === task.column_id)!;
			const taskIndex = taskColumn.tasks!.findIndex((t) => t.id === task.id);
			taskColumn!.tasks![taskIndex] = task;
			// data!.columns = [...data!.columns!];
			manualUpdate(data!);
		}
	});

	return { isLoading: isLoading || columnsMutation.isLoading, data, refetch, manualUpdate, columnsMutation };
}
