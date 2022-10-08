import { useEffect, useState } from 'react';
import { Project } from '../utils/supabase/projects';

type Pos = {
	x: number;
	y: number;
};
export function useProjectKeyboardNavigation(project: Project) {
	const [position, setPosition] = useState<Pos>({ x: 0, y: 0 });

	// console.log(position, project?.columns && project.columns[position.x].tasks![position.y]);
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (!project) return;
			if (project.columns === undefined) return;
			if (project.columns.length === 0) return;

			const target = e.target as HTMLElement;
			if (target.tagName === 'INPUT') return;

			// console.log('evented', target.tagName, e.key, project!.columns![position.x].tasks![position.y]);

			if (e.key === 'ArrowRight') {
				return setPosition((prev) => {
					const newX = (prev.x + 1) % project.columns!.length;
					return { x: newX, y: Math.min(prev.y, project!.columns![newX].tasks!.length - 1) };
				});
			}
			if (e.key === 'ArrowUp') {
				return setPosition((prev) => {
					const newY = (prev.y + project!.columns![prev.x].tasks!.length - 1) % project!.columns![prev.x].tasks!.length;
					return { x: prev.x, y: newY };
				});
			}
			if (e.key === 'ArrowLeft') {
				return setPosition((prev) => {
					const newX = (prev.x + project.columns!.length - 1) % project.columns!.length;
					return { x: newX, y: Math.min(prev.y, project!.columns![newX].tasks!.length - 1) };
				});
			}
			if (e.key === 'ArrowDown') {
				return setPosition((prev) => {
					const newY = (prev.y + 1) % project!.columns![prev.x].tasks!.length;
					return { x: prev.x, y: newY };
				});
			}
			if (e.key === 'Enter') return;
			if (e.key === 'Escape') return;
			if (e.key === ' ') return;
		};
		window.addEventListener('keyup', listener);

		return () => {
			window.removeEventListener('keyup', listener);
		};
	}, [project, setPosition]);

	return { position };
}
