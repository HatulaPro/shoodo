import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { getPermById, Perm } from '../utils/supabase/perms';
import { Column, FullProject, Project, Task } from '../utils/supabase/projects';
import { sortByImportance } from './useQueryProject';
import { useUser } from './useUser';

export type Message = {
	user: string;
	content: string;
};

export type MessageHandler = {
	sendMessage: (message: string) => void;
	clearMessages: () => void;
	messages: Message[];
	unread: number;
	onlineUsers: Presence[];
};

type Presence = { presence_ref: string; user: string };

export default function useRealtimeProject(project: FullProject | undefined, onUpdate: (proj: FullProject) => void): MessageHandler {
	const { user } = useUser();
	const [messages, setMessages] = useState<Message[]>([]);
	const [unread, setUnread] = useState<number>(0);
	const [onlineUsers, setOnlineUsers] = useState<Presence[]>([]);

	useEffect(() => {
		if (!project) return;
		if (!user) return;
		const channel = supabase.channel(`project-${project.id}`, {
			config: {
				presence: {
					key: user.email!,
				},
			},
		});
		const realtimeProjectSubscription = channel
			.on<Project>('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects', filter: `id=eq.${project.id}` }, (payload) => {
				onUpdate({ ...project, ...payload.new });
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
					console.log('update payload', payload);
					const newColId = payload.new.column_id;
					let newColIndex = 0;
					const newCol = project.columns.find((c, i) => {
						if (c.id === newColId) {
							newColIndex = i;
							return true;
						}
						return false;
					});

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
						for (const col of project.columns) {
							// Deleting from old column_id
							const newTasks = col.tasks.filter((oldTask) => {
								return oldTask.id !== payload.new.id;
							});
							col.tasks = newTasks;

							if (col.id === newColId) {
								col.tasks = sortByImportance([{ ...payload.new, column_id: col.id }, ...col.tasks]);
							}
						}
					}
					project.columns[newColIndex] = { ...newCol };
					onUpdate(project);
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
			.on('broadcast', { event: 'message' }, (payload) => {
				setMessages((prev) => [...prev, { user: payload.user, content: payload.content }]);
				setUnread((prev) => prev + 1);
			})
			.on('presence', { event: 'join' }, (payload) => setOnlineUsers((prev) => [...(payload.newPresences as Presence[]), ...prev]))
			.on('presence', { event: 'leave' }, (payload) =>
				setOnlineUsers((prev) => {
					const leftSet = new Set(payload.leftPresences.map((p) => p.presence_ref));
					return prev.filter((p) => !leftSet.has(p.presence_ref));
				})
			)
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await channel.track({ user: user.email! });
				}
			});
		return () => {
			realtimeProjectSubscription.unsubscribe();
		};
	}, [supabase, project, user]);

	return {
		sendMessage: (message: string) => {
			if (!project) return;
			if (!user) return;
			const channel = supabase.getChannels().find((val) => val.topic === `realtime:project-${project.id}`);
			if (channel === undefined) return;

			channel.send({ type: 'broadcast', event: 'message', content: message, user: user.email! });
			setMessages([...messages, { content: message, user: user.email! }]);
		},
		clearMessages: () => setUnread(0),
		messages,
		unread,
		onlineUsers,
	};
}
