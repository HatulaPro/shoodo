import { supabase } from './client';

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
};

export async function getUserProjects(userId: string): Promise<Project[]> {
	const result = await supabase.from('projects').select('*').eq('user_id', userId);
	if (result.error) {
		console.log(result);

		throw new Error(result.error.message);
	}
	const data = result.data as Project[];
	return data;
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
	const { data, error } = await supabase.from<Project>('projects').delete().eq('id', project_id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data.length > 0;
}

export async function getProjectById(project_id: number): Promise<Project> {
	const { data, error } = await supabase.from<Project>('projects').select('*, columns ( *, tasks ( * ) )').eq('id', project_id).single();

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
	const { data, error } = await supabase.from<Column>('columns').delete().eq('id', column_id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data.length > 0;
}
