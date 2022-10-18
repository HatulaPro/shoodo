import { supabase } from './client';

export type Perm = {
	id: number;
	guest_id: string;
	project_id: number;
	can_edit: boolean;
	user: { id: string; email: string };
};

export async function getPermById(perm_id: number): Promise<Perm> {
	const { data, error } = await supabase.from<Perm>('perms').select('*, user:users ( * )').eq('id', perm_id).single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return data;
}
