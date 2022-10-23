import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from '../../../utils/supabase/auth';
import { getServiceSupabase } from '../../../utils/supabase/client';
import { Perm } from '../../../utils/supabase/perms';

type ValidInput = {
	permId: number;
};

function isValid(data: any): ValidInput {
	if (!data || typeof data.permId !== 'number' || data.permId < 0) throw new Error('invalid data');
	return { permId: data.permId };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const supabase = getServiceSupabase();

	try {
		const token = req.headers.authorization;
		const user = getUserFromJWT(token);

		const { permId } = isValid(req.body);

		// Checking if the project belongs to the user
		const perm = await supabase.from('perms').select('*, user:projects ( id:user_id )').eq('id', permId).single();

		if (perm.error) {
			console.log(perm.error);
			return res.json({ error: 'Perm not found' });
		}

		const permData = perm.data as Perm & { user: { id: string } };

		if (permData.user.id !== user.id) {
			return res.json({ error: 'Perm not found' });
		}

		const [deleted] = await Promise.all([supabase.from('perms').delete().eq('id', permId).select().single(), supabase.from('history').delete().eq('project_id', permData.project_id).eq('user_id', permData.guest_id)]);

		return res.json({ success: true, data: deleted.data });
	} catch (e: any) {
		return res.json({ error: e.message });
	}
}
