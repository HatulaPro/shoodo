import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromJWT } from '../../utils/supabase/auth';
import { getServiceSupabase } from '../../utils/supabase/client';

type ValidInput = {
	email: string;
	canEdit: 'viewAndEdit' | 'viewOnly';
	projectId: number;
};

function isValid(data: any): ValidInput {
	if (!data || !data.email || !data.canEdit || !data.projectId) throw new Error('invalid data');
	if (typeof data.email !== 'string' || typeof data.canEdit !== 'string' || typeof data.projectId !== 'number') throw new Error('invalid data');
	const { email, canEdit, projectId } = data as ValidInput;
	if (canEdit !== 'viewAndEdit' && canEdit !== 'viewOnly') throw new Error('invalid data');
	if (!email.match(/\S+@\S+\.\S+/)) throw new Error('invalid data');
	return { email, canEdit, projectId };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const supabase = getServiceSupabase();

	try {
		const token = req.headers.authorization;
		const user = getUserFromJWT(token);

		const { email, canEdit, projectId } = isValid(req.body);

		if (email === user.email) return res.json({ error: 'Self invite is not allowed' });

		const { data, error } = await supabase.rpc('edit_perm', { email, pid: projectId, can_edit: canEdit === 'viewAndEdit', auth_id: user.id }).single();
		if (error) {
			return res.json({ error });
		}
		return res.json({ success: true, data: { ...data, user: { email: email, guest_id: data.guest_id } } });
	} catch (e: any) {
		return res.json({ error: e.message });
	}
}
