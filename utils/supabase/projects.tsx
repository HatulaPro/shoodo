import { supabase } from './client';
import type { History } from './history';
import type { Perm } from './perms';

export type Task = {
	id: number;
	project_id: number;
	column_id: number;
	content: string;
	done: boolean;
	importance: number;
};

export type Column = {
	id: number;
	project_id: number;
	name: string;
	style: string;
	importance: number;
	tasks?: Task[];
};

export type Project = {
	id: number;
	created_at: string;
	name: string;
	description: string;
	user_id: string;
	columns?: Column[];
	perms?: Perm[];
	user?: { id: string; email: string };
};

export async function getUserProjects(userId: string): Promise<Project[]> {
	const result = await supabase.from<Project>('projects').select('*').eq('user_id', userId);
	if (result.error) {
		console.log(result);

		throw new Error(result.error.message);
	}
	return result.data;
}

export async function getUserInvites(userId: string): Promise<Project[]> {
	const result = await supabase.from<Perm>('perms').select('*, project:projects ( *, user:users( * ) )').eq('guest_id', userId);
	if (result.error) {
		console.log(result);

		throw new Error(result.error.message);
	}

	return result.data.map(({ project }) => project!);
}

export async function createProject(user_id: string, name: string, description: string): Promise<Project> {
	const { data, error } = await supabase.from<Project>('projects').insert([{ user_id, name, description }]);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data[0];
}

export async function deleteProject(project_id: number): Promise<boolean> {
	const { error: tasksError } = await supabase.from<Task>('tasks').delete().eq('project_id', project_id);

	if (tasksError) {
		console.log(tasksError);
		throw new Error(tasksError.message);
	}

	const { error: colsError } = await supabase.from<Column>('columns').delete().eq('project_id', project_id);

	if (colsError) {
		console.log(colsError);
		throw new Error(colsError.message);
	}

	const { error: permsError } = await supabase.from<Perm>('perms').delete().eq('project_id', project_id);

	if (permsError) {
		console.log(permsError);
		throw new Error(permsError.message);
	}

	const { error: historyError } = await supabase.from<History>('history').delete().eq('project_id', project_id);

	if (historyError) {
		console.log(historyError);
		throw new Error(historyError.message);
	}

	const { data, error } = await supabase.from<Project>('projects').delete().eq('id', project_id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data.length > 0;
}

export async function getProjectById(project_id: number): Promise<Project> {
	// bad: tasks!column_id
	const { data, error } = await supabase.from<Project>('projects').select('*, columns ( *, tasks!tasks_column_id_fkey ( * ) ), perms ( *, user:users ( * ) ), user:users ( * )').eq('id', project_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function updateProjectById(project_id: number, values: Partial<Project>): Promise<Project> {
	const { data, error } = await supabase.from<Project>('projects').update(values).eq('id', project_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function createColumn(project_id: number, importance: number): Promise<Column> {
	const { data, error } = await supabase.from<Column>('columns').insert({ importance, project_id, name: '...', style: 'blue' }).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	data.tasks = [];

	return data;
}

export async function updateColumnById(column_id: number, values: Partial<Column>): Promise<Column> {
	const { data, error } = await supabase.from<Column>('columns').update(values).eq('id', column_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function deleteColumn(column_id: number): Promise<boolean> {
	const { error: tasksError } = await supabase.from<Task>('tasks').delete().eq('column_id', column_id);

	if (tasksError) {
		console.log(tasksError);
		throw new Error(tasksError.message);
	}

	const { data, error } = await supabase.from<Column>('columns').delete().eq('id', column_id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data.length > 0;
}

export async function createTask(project_id: number, column_id: number, content: string, importance: number): Promise<Task> {
	const { data, error } = await supabase.from<Task>('tasks').insert({ importance, project_id, column_id, content, done: false }).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function updateTaskById(task_id: number, values: Partial<Task>): Promise<Task> {
	const { data, error } = await supabase.from<Task>('tasks').update(values).eq('id', task_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function deleteTask(task_id: number): Promise<boolean> {
	const { data, error } = await supabase.from<Task>('tasks').delete().eq('id', task_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return Boolean(data);
}

export async function updateTaskImportances(column: Column): Promise<Task[]> {
	const { data, error } = await supabase.from<Task>('tasks').upsert(
		column.tasks!.map((t, i) => {
			return { ...t, importance: i * Math.pow(2, 32) };
		})
	);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}
