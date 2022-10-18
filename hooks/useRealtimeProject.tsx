import { useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { getPermById, Perm } from '../utils/supabase/perms';
import type { Project } from '../utils/supabase/projects';

export default function useRealtimeProject(project: Project | undefined, onUpdate: (proj: Project) => void) {
	useEffect(() => {
		if (!project) return;
		const realtimeProjectSubscription = supabase
			.from<Project>(`projects:id=eq.${project.id}`)
			.on('*', (payload) => {
				if (payload.eventType === 'UPDATE') {
					onUpdate({ ...project, ...payload.new } as Project);
				} else {
					throw new Error('Unhandled realtime event');
				}
			})
			.subscribe();

		const realtimePermsSubscription = supabase
			.from<Perm>(`perms:project_id=eq.${project.id}`)
			.on('*', (payload) => {
				console.log(payload);
				if (payload.eventType === 'UPDATE') {
					const newPerms = project.perms!.map((oldPerm) => {
						if (oldPerm.id === payload.new.id) {
							return { ...oldPerm, ...payload.new } as Perm;
						}
						return oldPerm;
					});
					project.perms = newPerms;
					onUpdate(project);
				} else if (payload.eventType === 'DELETE') {
					const newPerms = project.perms!.filter((oldPerm) => oldPerm.id !== payload.old.id);
					project.perms = newPerms;
					onUpdate(project);
				} else if (payload.eventType === 'INSERT') {
					const originalPerms = project.perms!;
					const alreadyHasNewId = Boolean(originalPerms.find((p) => p.id === payload.new.id));
					if (!alreadyHasNewId) {
						const newPerms = [{ ...payload.new, user: { id: payload.new.guest_id, email: 'loading...' } } as Perm, ...originalPerms];
						project.perms = newPerms;
						onUpdate(project);
						getPermById(payload.new.id).then((data) => {
							project.perms = [data, ...originalPerms];
						});
					}
				}
			})
			.subscribe();

		return () => {
			supabase.removeSubscription(realtimeProjectSubscription);
			supabase.removeSubscription(realtimePermsSubscription);
		};
	}, [supabase, project]);

	return [];
}
