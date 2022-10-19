import { supabase } from './client';
import type { Project } from './projects';

export type Perm = {
	id: number;
	guest_id: string;
	project_id: number;
	can_edit: boolean;
	user: { id: string; email: string };
	project?: Project;
};

export async function getPermById(perm_id: number): Promise<Perm> {
	const { data, error } = await supabase.from<Perm>('perms').select('*, user:users ( * )').eq('id', perm_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}

export async function deleteOwnPerm(user_id: string, project_id: number): Promise<boolean> {
	const { data, error } = await supabase.from<Perm>('perms').delete().eq('guest_id', user_id).eq('project_id', project_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return Boolean(data);
}
