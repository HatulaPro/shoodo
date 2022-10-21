import { supabase } from './client';
import type { Project } from './projects';
import { definitions } from './types';

export type History = definitions['history'];
// {
// 	id: number;
// 	user_id: string;
// 	project_id: number;
// 	last_used: string;
// 	project?: Project;
// };

export async function setHistory(project_id: number, user_id: string): Promise<History> {
	const timestamp = new Date().toISOString();
	const { data, error } = await supabase.from('history').upsert({ project_id, user_id, last_used: timestamp }, { onConflict: 'project_id,user_id' }).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function getHistories(count: number): Promise<Project[]> {
	const { data, error } = await supabase.from('history').select('*, project:projects ( * )').order('last_used', { ascending: false }).limit(count);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	const res = data.map((history) => (Array.isArray(history.project!) ? history.project[0] : history.project!));
	return res;
}
