import { PublicUser } from './auth';
import { supabase } from './client';
import type { History } from './history';
import type { PermWithUser } from './perms';
import type { definitions } from './types';

export type Task = definitions['tasks'];

export type Column = definitions['columns'];
export type ColumnWithTasks = Column & { tasks: Task[] };
// {
// 	id: number;
// 	project_id: number;
// 	name: string;
// 	style: string;
// 	importance: number;
// 	tasks?: Task[];
// };

export type Project = definitions['projects'];
export type ProjectWithHistory = Project & { history: History[] };
export type ProjectWithHistoryAndUser = ProjectWithHistory & { user: PublicUser };
export type FullProject = Project & { columns: ColumnWithTasks[]; perms: PermWithUser[]; user: PublicUser };
// {
// 	id: number;
// 	created_at: string;
// 	name: string;
// 	description: string;
// 	user_id: string;
// 	history?: History[];
// 	columns?: Column[];
// 	perms?: Perm[];
// 	user?: { id: string; email: string };
// };

export async function getUserProjects(userId: string): Promise<ProjectWithHistory[]> {
	const result = await supabase.from('projects').select('*, history ( * )').eq('user_id', userId);

	if (result.error) {
		console.log(result);
		throw new Error(result.error.message);
	}

	return result.data as ProjectWithHistory[];
}

export async function getUserInvites(userId: string): Promise<ProjectWithHistoryAndUser[]> {
	const result = await supabase.from('perms').select('*, project:projects ( *, user:users( * ), history ( * ) )').eq('guest_id', userId);
	if (result.error) {
		console.log(result);
		throw new Error(result.error.message);
	}

	return result.data.map(({ project }) => {
		return project! as ProjectWithHistoryAndUser;
	});
}

export async function createProject(user_id: string, name: string, description: string): Promise<ProjectWithHistory> {
	const { data, error } = await supabase.from('projects').insert([{ user_id, name, description }]).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	const dataWithHistory = data as ProjectWithHistory;
	dataWithHistory.history = [];
	return dataWithHistory;
}

export async function deleteProject(project_id: number): Promise<boolean> {
	const { error: tasksError } = await supabase.from('tasks').delete().eq('project_id', project_id);

	if (tasksError) {
		console.log(tasksError);
		throw new Error(tasksError.message);
	}

	const { error: colsError } = await supabase.from('columns').delete().eq('project_id', project_id);

	if (colsError) {
		console.log(colsError);
		throw new Error(colsError.message);
	}

	const { error: permsError } = await supabase.from('perms').delete().eq('project_id', project_id);

	if (permsError) {
		console.log(permsError);
		throw new Error(permsError.message);
	}

	const { error: historyError } = await supabase.from('history').delete().eq('project_id', project_id);

	if (historyError) {
		console.log(historyError);
		throw new Error(historyError.message);
	}

	const { data, error } = await supabase.from('projects').delete().eq('id', project_id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data.length > 0;
}

export async function getProjectById(project_id: number): Promise<FullProject> {
	// bad: tasks!column_id
	const { data, error } = await supabase.from('projects').select('*, columns ( *, tasks!tasks_column_id_fkey ( * ) ), perms ( *, user:users ( * ) ), user:users ( * )').eq('id', project_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data as FullProject;
}

export async function updateProjectById(project_id: number, values: Partial<Project>): Promise<Project> {
	const { data, error } = await supabase.from('projects').update(values).eq('id', project_id).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function createColumn(project_id: number, importance: number): Promise<ColumnWithTasks> {
	const { data, error } = await supabase.from('columns').insert({ importance, project_id, name: '...', style: 'blue' }).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	const dataWithTasks = data as ColumnWithTasks;
	dataWithTasks.tasks = [];

	return dataWithTasks;
}

export async function updateColumnById(column_id: number, values: Partial<Column>): Promise<Column> {
	const { data, error } = await supabase.from('columns').update(values).eq('id', column_id).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function deleteColumn(column_id: number): Promise<boolean> {
	const { error: tasksError } = await supabase.from('tasks').delete().eq('column_id', column_id);

	if (tasksError) {
		console.log(tasksError);
		throw new Error(tasksError.message);
	}

	const { data, error } = await supabase.from('columns').delete().eq('id', column_id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data?.length > 0;
}

export async function createTask(project_id: number, column_id: number, content: string, importance: number): Promise<Task> {
	const { data, error } = await supabase.from('tasks').insert({ importance, project_id, column_id, content, done: false }).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function updateTaskById(task_id: number, values: Partial<Task>): Promise<Task> {
	const { data, error } = await supabase.from('tasks').update(values).eq('id', task_id).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function deleteTask(task_id: number): Promise<boolean> {
	const { data, error } = await supabase.from('tasks').delete().eq('id', task_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return Boolean(data);
}

export async function updateTaskImportances(column: ColumnWithTasks): Promise<Task[]> {
	const { data, error } = await supabase
		.from('tasks')
		.upsert(
			column.tasks.map((t, i) => {
				return { ...t, importance: i * Math.pow(2, 32) };
			})
		)
		.select();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}
