import { useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { getPermById, Perm } from '../utils/supabase/perms';
import type { Column, Project } from '../utils/supabase/projects';
import { sortByImportance } from './useQueryProject';

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

		const realtimeColumnSubscription = supabase
			.from<Column>(`columns:project_id=eq.${project.id}`)
			.on('*', (payload) => {
				console.log(payload);
				if (payload.eventType === 'UPDATE') {
					const newColumns = project.columns!.map((oldColumn) => {
						if (oldColumn.id === payload.new.id) {
							return { ...oldColumn, ...payload.new } as Column;
						}
						return oldColumn;
					});
					project.columns = sortByImportance(newColumns);
					onUpdate(project);
				} else if (payload.eventType === 'DELETE') {
					const newColumns = project.columns!.filter((oldColumn) => oldColumn.id !== payload.old.id);
					project.columns = newColumns;
					onUpdate(project);
				} else if (payload.eventType === 'INSERT') {
					const originalColumns = project.columns!;
					const alreadyHasNewId = Boolean(originalColumns.find((c) => c.id === payload.new.id));
					if (!alreadyHasNewId) {
						const newColumns = [{ ...payload.new, tasks: [] } as Column, ...originalColumns];
						project.columns = newColumns;
						onUpdate(project);
					}
				}
			})
			.subscribe();

		return () => {
			supabase.removeSubscription(realtimeProjectSubscription);
			supabase.removeSubscription(realtimePermsSubscription);
			supabase.removeSubscription(realtimeColumnSubscription);
		};
	}, [supabase, project]);

	return [];
}
