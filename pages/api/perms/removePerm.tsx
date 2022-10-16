import type { NextApiRequest, NextApiResponse } from 'next';
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
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (!user) return res.json({ error: 'Not authenticated' });

	try {
		const { permId } = isValid(req.body);

		// Checking if the project belongs to the user
		const perm = await supabase.from<Perm>('perms').select('*, user:projects ( id:user_id )').eq('id', permId).single();

		if (perm.error) {
			console.log(perm.error);
			return res.json({ error: 'Perm not found' });
		}

		if (perm.data.user.id !== user.id) {
			return res.json({ error: 'Perm not found' });
		}

		const deleted = await supabase.from<Perm>('perms').delete().eq('id', permId).single();

		return res.json({ success: true, data: deleted.data });
	} catch (e: any) {
		return res.json({ error: e.message });
	}
}
