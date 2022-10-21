import { useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { getPermById, Perm } from '../utils/supabase/perms';
import { Column, FullProject, Project, Task } from '../utils/supabase/projects';
import { sortByImportance } from './useQueryProject';
import { useUser } from './useUser';

export default function useRealtimeProject(project: FullProject | undefined, onUpdate: (proj: FullProject) => void, onMessage: (payload: { [key: string]: any; type: 'broadcast'; event: string }) => void) {
	const { user } = useUser();
	useEffect(() => {
		if (!project) return;
		if (!user) return;
		const channel = supabase.channel(`project-${project.id}`);
		const realtimeProjectSubscription = channel
			.on<Project>('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${project.id}` }, (payload) => {
				if (payload.eventType === 'UPDATE') {
					onUpdate({ ...project, ...payload.new });
				} else {
					throw new Error('Unhandled realtime event');
				}
			})
			.on<Perm>('postgres_changes', { event: '*', schema: 'public', table: 'perms', filter: `project_id=eq.${project.id}` }, (payload) => {
				if (payload.eventType === 'UPDATE') {
					const newPerms = project.perms.map((oldPerm) => {
						if (oldPerm.id === payload.new.id) {
							return { ...oldPerm, ...payload.new };
						}
						return oldPerm;
					});
					project.perms = newPerms;
					onUpdate(project);
				} else if (payload.eventType === 'DELETE') {
					const newPerms = project.perms.filter((oldPerm) => oldPerm.id !== payload.old.id);
					project.perms = newPerms;
					onUpdate(project);
				} else if (payload.eventType === 'INSERT') {
					const originalPerms = project.perms;
					const alreadyHasNewId = Boolean(originalPerms.find((p) => p.id === payload.new.id));
					if (!alreadyHasNewId) {
						const newPerms = [{ ...payload.new, user: { id: payload.new.guest_id, email: 'loading...' } }, ...originalPerms];
						project.perms = newPerms;
						onUpdate(project);
						getPermById(payload.new.id).then((data) => {
							project.perms = [data, ...originalPerms];
						});
					}
				}
			})
			.on<Column>('postgres_changes', { event: '*', schema: 'public', table: 'columns', filter: `project_id=eq.${project.id}` }, (payload) => {
				if (payload.eventType === 'UPDATE') {
					const newColumns = project.columns.map((oldColumn) => {
						if (oldColumn.id === payload.new.id) {
							return { ...oldColumn, ...payload.new };
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
					const originalColumns = project.columns;
					const alreadyHasNewId = Boolean(originalColumns.find((c) => c.id === payload.new.id));
					if (!alreadyHasNewId) {
						const newColumns = [{ ...payload.new, tasks: [] }, ...originalColumns];
						project.columns = newColumns;
						onUpdate(project);
					}
				}
			})
			.on<Task>('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${project.id}` }, (payload) => {
				if (payload.eventType === 'UPDATE') {
					const newColId = payload.new.column_id;
					const newCol = project.columns.find((c) => c.id === newColId);

					if (newCol === undefined) return;

					const newColHasTask = Boolean(newCol.tasks!.find((c) => c.id === payload.new.id));

					// If the column_id has not changed:
					if (newColHasTask) {
						const newTasks = newCol.tasks.map((oldTask) => {
							if (oldTask.id === payload.new.id) {
								return { ...oldTask, ...payload.new };
							}
							return oldTask;
						});

						newCol.tasks = sortByImportance(newTasks);
					}
					// Finding the old column of current task:
					else {
						for (const col of project.columns!) {
							// Deleting from old column_id
							const newTasks = col.tasks.filter((oldTask) => {
								const res = oldTask.id !== payload.new.id;
								return res;
							});
							col.tasks = newTasks;

							if (col.id === newColId) {
								col.tasks = sortByImportance([{ ...payload.new, column_id: col.id }, ...col.tasks]);
							}
						}
					}

					onUpdate({ ...project, columns: [...project.columns] });
				} else if (payload.eventType === 'DELETE') {
					for (const col of project.columns!) {
						const newTasks = col.tasks.filter((oldTask) => {
							const res = oldTask.id !== payload.old.id;
							return res;
						});
						col.tasks = newTasks;
					}

					onUpdate({ ...project, columns: [...project.columns] });
				} else if (payload.eventType === 'INSERT') {
					const colId = payload.new.column_id;
					const col = project.columns.find((c) => c.id === colId);
					if (col === undefined) return;

					const originalTasks = col.tasks!;
					const alreadyHasNewId = Boolean(originalTasks.find((c) => c.id === payload.new.id));
					if (!alreadyHasNewId) {
						const newTasks = [{ ...payload.new }, ...originalTasks];
						col.tasks = newTasks;
						onUpdate(project);
					}
				}
			})
			.on('broadcast', { event: 'message' }, onMessage)
			.subscribe();
		return () => {
			realtimeProjectSubscription.unsubscribe();
		};
	}, [supabase, project, user]);

	return (message: string) => {
		if (!project) return;
		if (!user) return;
		const channel = supabase.getChannels().find((val) => val.topic === `realtime:project-${project.id}`);
		if (channel === undefined) return;

		channel.send({ type: 'broadcast', event: 'message', message, user: user.email });
	};
}
