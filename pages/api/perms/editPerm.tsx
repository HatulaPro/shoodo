import type { NextApiRequest, NextApiResponse } from 'next';
import type { PublicUser } from '../../../utils/supabase/auth';
import { getServiceSupabase } from '../../../utils/supabase/client';
import { Perm } from '../../../utils/supabase/perms';
import { Project } from '../../../utils/supabase/projects';

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
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (!user) return res.json({ error: 'Not authenticated' });

	try {
		const { email, canEdit, projectId } = isValid(req.body);

		if (email === user.email) return res.json({ error: 'Self invite is not allowed' });

		// Checking if a user with that email exists and that the project belongs to the user
		const [guest, project] = await Promise.all([supabase.from<PublicUser>('users').select('*').eq('email', email).single(), supabase.from<Project>('projects').select('*').eq('id', projectId).single()]);

		if (guest.error) {
			return res.json({ error: 'User not found, are you sure they have a Shoodo account?' });
		}

		if (project.error || project.data.user_id !== user.id) {
			return res.json({ error: 'Project not found' });
		}

		const newPerm = await supabase
			.from<Perm>('perms')
			.upsert({ can_edit: canEdit === 'viewAndEdit', guest_id: guest.data.id, project_id: projectId }, { onConflict: 'guest_id,project_id' })
			.single();

		return res.json({ success: true, data: { ...newPerm.data, user: { id: guest.data.id, email: guest.data.email } } });
	} catch (e: any) {
		return res.json({ error: e.message });
	}
}
