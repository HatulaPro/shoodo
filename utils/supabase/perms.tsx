import { PublicUser } from './auth';
import { supabase } from './client';
import type { definitions } from './types';

export type Perm = definitions['perms'];
export type PermWithUser = Perm & {
	user: PublicUser;
};
// TODO: Perm with project?
// {
// 	id: number;
// 	guest_id: string;
// 	project_id: number;
// 	can_edit: boolean;
// 	user: { id: string; email: string };
// 	project?: Project;
// };

export async function getPermById(perm_id: number): Promise<PermWithUser> {
	const { data, error } = await supabase.from('perms').select('*, user:users ( * )').eq('id', perm_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data as PermWithUser;
}

export async function deleteOwnPerm(user_id: string, project_id: number): Promise<boolean> {
	const { data, error } = await supabase.from('perms').delete().eq('guest_id', user_id).eq('project_id', project_id).select().single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return Boolean(data);
}
