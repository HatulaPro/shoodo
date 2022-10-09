import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { Column, Project, Task } from '../utils/supabase/projects';
import { createColumn, createTask, deleteColumn, deleteTask, getProjectById, updateColumnById, updateTaskById } from '../utils/supabase/projects';

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
			column_id: number;
			update: Partial<Task>;
	  }
	| {
			type: 'DELETE_TASK';
			task_id: number;
			column_id: number;
	  }
	| {
			type: 'MOVE_TASK';
			nextIndex: number;
			currentIndex: number;
			task_id: number;
	  };

function sortByImportance<T extends { importance: number }>(arr: T[]): T[] {
	return arr.sort((a, b) => a.importance - b.importance);
}

export function useQueryProject(user: User | null) {
	const { query } = useRouter();
	const queryClient = useQueryClient();

	const parsedProject = query.project ? (JSON.parse(query.project as string) as Project) : undefined;

	console.log({ query });

	const projectId = typeof query.id === 'string' ? parseInt(query.id as string) : parsedProject?.id || -1;

	const { isLoading, data, refetch } = useQuery(
		['project', projectId],
		async () => {
			const proj = await getProjectById(projectId);
			proj.columns = sortByImportance(proj.columns!);
			for (const col of proj.columns!) {
				col.tasks = sortByImportance(col.tasks!);
			}
			return proj;
		},
		{
			refetchOnWindowFocus: false,
			enabled: user !== null && Boolean(query.id),
			retry: false,
			initialData: parsedProject,
			placeholderData: parsedProject,
			staleTime: 30 * 1000,
		}
	);

	function manualUpdate(newProject: Project) {
		queryClient.setQueryData(['project'], () => newProject);
	}

	const columnsMutation = useMutation(async (args: ColumnMutateArgs) => {
		if (args.type === 'CREATE') {
			const prevCols = data!.columns!;
			const bestImportance = (prevCols.length ? Math.min(...prevCols.map((column) => column.importance)) : Math.pow(2, 33)) - Math.pow(2, 32);
			data!.columns = sortByImportance([{ id: -1, importance: bestImportance, name: '...', project_id: data!.id, style: 'blue', tasks: [] }, ...prevCols]);
			createColumn(data!.id, bestImportance).then((col) => {
				data!.columns = sortByImportance([col, ...prevCols]);
				manualUpdate(data!);
			});
		} else if (args.type === 'UPDATE') {
			const index = data!.columns!.findIndex((c) => c.id === args.column_id);
			data!.columns![index] = { ...data!.columns![index], ...args.update };
			data!.columns = [...data!.columns!];
			updateColumnById(args.column_id!, args.update).then(() => {
				manualUpdate(data!);
			});
		} else if (args.type === 'DELETE') {
			data!.columns = data!.columns!.filter((col) => col.id !== args.column_id);
			deleteColumn(args.column_id);
			manualUpdate(data!);
		} else if (args.type === 'ADD_TASK') {
			const col = data!.columns!.find((col) => col.id === args.column_id)!;
			if (!col.tasks) {
				col.tasks = [];
			}

			const prevTasks = col.tasks!;
			const bestImportance = col.tasks.length ? Math.min(...col.tasks.map((task) => task.importance)) : Math.pow(2, 33);
			col.tasks = [{ column_id: col.id, content: args.content, done: false, id: -1, importance: -Infinity, project_id: data!.id }, ...prevTasks];
			createTask(data!.id, col.id, args.content, bestImportance - Math.pow(2, 32)).then((task) => {
				col.tasks = [task, ...prevTasks];
				manualUpdate(data!);
			});
		} else if (args.type === 'UPDATE_TASK') {
			updateTaskById(args.task_id, args.update);

			const taskColumn = data!.columns!.find((col) => col.id === args.column_id)!;
			const taskIndex = taskColumn.tasks!.findIndex((t) => t.id === args.task_id);
			const task = taskColumn.tasks![taskIndex];
			taskColumn.tasks![taskIndex] = { ...task, ...args.update };
			taskColumn.tasks! = sortByImportance(taskColumn.tasks!);
			manualUpdate(data!);
		} else if (args.type === 'DELETE_TASK') {
			deleteTask(args.task_id);

			const taskColumn = data!.columns!.find((col) => col.id === args.column_id)!;
			taskColumn.tasks = taskColumn.tasks!.filter((t) => t.id !== args.task_id);
			manualUpdate(data!);
		} else if (args.type === 'MOVE_TASK') {
			const nextIndex = Math.min(Math.max(args.nextIndex, 0), data!.columns!.length - 1);
			const currentColumn = data!.columns![args.currentIndex];
			const nextColumn = data!.columns![nextIndex];
			const taskIndex = currentColumn.tasks!.findIndex((t) => t.id === args.task_id);
			const task = currentColumn.tasks![taskIndex];
			currentColumn.tasks = currentColumn.tasks?.filter((t) => t.id !== args.task_id);

			const bestImportance = nextColumn.tasks!.length ? Math.min(...nextColumn.tasks!.map((t) => t.importance)) : Math.pow(2, 33);
			nextColumn.tasks = [task, ...nextColumn.tasks!];
			updateTaskById(task.id, { importance: bestImportance, column_id: nextColumn.id });
			manualUpdate(data!);
		}
	});

	return { isLoading: isLoading || columnsMutation.isLoading, data, refetch, manualUpdate, columnsMutation };
}
