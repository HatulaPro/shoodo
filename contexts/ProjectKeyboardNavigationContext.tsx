import React, { createContext, FC, useEffect, useState } from 'react';
import { Project } from '../utils/supabase/projects';

type Pos = {
	x: number;
	y: number;
};

type NavLocation = {
	column_id: number | null;
	task_id: number | null;
	util_column_id: number | null;
};

export const ProjectKeyboardNavigationContext = createContext<NavLocation>({ column_id: null, task_id: null, util_column_id: null });

export const ProjectKeyboardNavigationProvider: FC<{ project: Project | undefined; children: React.ReactNode }> = ({ project, children }) => {
	const [position, setPosition] = useState<Pos>({ x: 0, y: 0 });

	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (!project) return;
			if (project.columns === undefined) return;
			if (project.columns.length === 0) return;

			const target = e.target as HTMLElement;
			if (target.tagName === 'INPUT') return;

			// console.log('evented', target.tagName, e.key, project!.columns![position.x].tasks![position.y]);
			// x: index of column
			// y: -1: highlight column title, [0, len - 1]: highlight task at [y-1], len: Add new...
			if (e.key === 'ArrowRight') {
				return setPosition((prev) => {
					const newX = (prev.x + 1) % project.columns!.length;
					return { x: newX, y: Math.min(prev.y, project!.columns![newX].tasks!.length) };
				});
			}
			if (e.key === 'ArrowUp') {
				return setPosition((prev) => {
					const mod = project!.columns![prev.x].tasks!.length + 2;
					const newY = ((prev.y + mod) % mod) - 1;
					return { x: prev.x, y: newY };
				});
			}
			if (e.key === 'ArrowLeft') {
				return setPosition((prev) => {
					const newX = (prev.x + project.columns!.length - 1) % project.columns!.length;
					return { x: newX, y: Math.min(prev.y, project!.columns![newX].tasks!.length) };
				});
			}
			if (e.key === 'ArrowDown') {
				return setPosition((prev) => {
					const mod = project!.columns![prev.x].tasks!.length + 2;
					const newY = ((prev.y + 2) % mod) - 1;
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

	const value: NavLocation = project?.columns
		? {
				column_id: position.y === -1 ? project.columns[position.x].id : null,
				task_id: position.y >= 0 && position.y < project.columns[position.x].tasks!.length ? project.columns[position.x].tasks![position.y].id : null,
				util_column_id: project.columns[position.x].id,
		  }
		: { column_id: null, task_id: null, util_column_id: null };

	console.log(value, position);

	return <ProjectKeyboardNavigationContext.Provider value={value}>{children}</ProjectKeyboardNavigationContext.Provider>;
};
