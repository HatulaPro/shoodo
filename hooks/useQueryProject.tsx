import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Column, ColumnWithTasks, createColumn, createTask, deleteColumn, deleteTask, FullProject, getProjectById, Task, updateColumnById, updateTaskById, updateTaskImportances } from '../utils/supabase/projects';

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
	  }
	| {
			type: 'UPDATE_TASK_INDEXES';
			column: ColumnWithTasks;
	  };

export function sortByImportance<T extends { importance: number }>(arr: T[]): T[] {
	return arr.sort((a, b) => a.importance - b.importance);
}

export function useQueryProject(user: User | null) {
	const { query } = useRouter();
	const queryClient = useQueryClient();

	const parsedProject = query.project ? (JSON.parse(query.project as string) as FullProject) : undefined;

	const projectId = typeof query.id === 'string' ? parseInt(query.id) : parsedProject?.id || -1;

	const { isLoading, data, refetch } = useQuery(
		['project', projectId],
		async () => {
			const proj = await getProjectById(projectId);
			proj.columns = sortByImportance(proj.columns);
			for (const col of proj.columns) {
				col.tasks = sortByImportance(col.tasks);
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

	const manualUpdate = useCallback(
		(newProject: FullProject) => {
			queryClient.setQueryData(['project', newProject.id], () => newProject);
		},
		[queryClient]
	);

	const columnsMutation = useMutation(async (args: ColumnMutateArgs) => {
		if (!data) {
			throw new Error('No project.');
		}
		if (args.type === 'CREATE') {
			const prevCols = data.columns;
			const bestImportance = (prevCols.length ? Math.min(...prevCols.map((column) => column.importance)) : Math.pow(2, 33)) - Math.pow(2, 32);
			data.columns = [{ id: -1, importance: bestImportance, name: '...', project_id: data.id, style: 'blue', tasks: [] }, ...prevCols];
			createColumn(data.id, bestImportance).then((col) => {
				data.columns[0].id = col.id;
				manualUpdate(data);
			});
		} else if (args.type === 'UPDATE') {
			const index = data.columns.findIndex((c) => c.id === args.column_id);
			data.columns[index] = { ...data.columns[index], ...args.update };
			updateColumnById(args.column_id, args.update);
		} else if (args.type === 'DELETE') {
			const index = data.columns.findIndex((col) => col.id === args.column_id);
			data.columns.splice(index, 1);
			deleteColumn(args.column_id);
		} else if (args.type === 'ADD_TASK') {
			const col = data.columns.find((col) => col.id === args.column_id)!;
			if (!col.tasks) {
				col.tasks = [];
			}

			const bestImportance = col.tasks.length ? Math.min(...col.tasks.map((task) => task.importance)) : Math.pow(2, 33);
			createTask(data.id, col.id, args.content, bestImportance - Math.pow(2, 32)).then((task) => {
				if (!col.tasks.find((t) => t.id === task.id)) {
					col.tasks = [task, ...col.tasks];
					manualUpdate(data);
				}
			});
		} else if (args.type === 'UPDATE_TASK') {
			updateTaskById(args.task_id, args.update);

			const taskColumn = data.columns.find((col) => col.id === args.column_id)!;
			const taskIndex = taskColumn.tasks.findIndex((t) => t.id === args.task_id);
			const task = taskColumn.tasks[taskIndex];
			taskColumn.tasks[taskIndex] = { ...task, ...args.update };
			if (args.update.importance !== undefined) {
				taskColumn.tasks = sortByImportance(taskColumn.tasks);
			}
		} else if (args.type === 'DELETE_TASK') {
			deleteTask(args.task_id);

			const taskColumn = data.columns.find((col) => col.id === args.column_id)!;
			taskColumn.tasks = taskColumn.tasks.filter((t) => t.id !== args.task_id);
		} else if (args.type === 'MOVE_TASK') {
			console.log(args);
			const nextIndex = Math.min(Math.max(args.nextIndex, 0), data.columns.length - 1);
			const currentColumn = data.columns[args.currentIndex];
			const nextColumn = data.columns[nextIndex];
			const taskIndex = currentColumn.tasks.findIndex((t) => t.id === args.task_id);
			const task = currentColumn.tasks.splice(taskIndex, 1)[0];

			const bestImportance = nextColumn.tasks.length ? Math.min(...nextColumn.tasks.map((t) => t.importance)) : Math.pow(2, 33);
			// nextColumn.tasks = [task, ...nextColumn.tasks];
			// manualUpdate(data);
			updateTaskById(task.id, { importance: bestImportance, column_id: nextColumn.id });
		} else if (args.type === 'UPDATE_TASK_INDEXES') {
			updateTaskImportances(args.column).then((tasks) => {
				args.column.tasks = tasks;
				manualUpdate(data);
			});
		}
	});

	return { isLoading: isLoading || columnsMutation.isLoading, data, refetch, manualUpdate, columnsMutation };
}
