import { supabase } from './client';

export type Project = {
	id: number;
	created_at: string;
	name: string;
	description: string;
	user_id: string;
};

export async function getUserProjects(): Promise<Project[]> {
	const result = await supabase.from('projects').select('*');
	if (result.error) {
		console.log(result);

		throw new Error(result.error.message);
	}
	const data = result.data as Project[];
	return data;
}
