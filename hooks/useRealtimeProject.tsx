import { useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import type { Project } from '../utils/supabase/projects';

export default function useRealtimeProject(project: Project | undefined, onUpdate: (proj: Project) => void) {
	useEffect(() => {
		if (!project) return;
		const realtimeSubscription = supabase
			.from<Project>(`projects:id=eq.${project.id}`)
			.on('*', (payload) => {
				if (payload.eventType === 'UPDATE') {
					onUpdate({ ...project, ...payload.new });
				}
			})
			.subscribe();

		return () => {
			supabase.removeSubscription(realtimeSubscription);
		};
	}, [supabase, project]);

	return [];
}
