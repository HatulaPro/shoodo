import React, { createContext, FC, useEffect, useRef, useState } from 'react';
import type { Project } from '../utils/supabase/projects';

type Pos = {
	x: number;
	y: number;
};

type Props = { [x: string]: unknown };

type RegisterToNav = (column_id: number | null, task_id: number | null) => Props;

export const ProjectKeyboardNavigationContext = createContext<RegisterToNav>((_a, _b) => {
	return {};
});

const NUMBER_OF_ACTIONS = 2;

export const ProjectKeyboardNavigationProvider: FC<{ project: Project | undefined; children: React.ReactNode }> = ({ project, children }) => {
	const [position, setPosition] = useState<Pos>({ x: -1, y: -1 });
	const [isUsingKeys, setUsingKeys] = useState<boolean>(false);
	const ref = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (!project) return;
			if (project.columns === undefined) return;

			const target = e.target as HTMLElement;
			if (target.tagName === 'INPUT') return;

			setUsingKeys(true);
			if (project.columns.length === 0) return setPosition({ x: -1, y: -1 });

			// console.log('evented', target.tagName, e.key, project!.columns![position.x].tasks![position.y]);
			// x: index of column
			// y: -1: highlight column title, [0, len - 1]: highlight task at [y-1], len: Add new...
			if (e.key === 'ArrowRight') {
				return setPosition((prev) => {
					if (prev.x === -1) {
						return { x: 0, y: -1 };
					}
					const newX = (prev.x + 1) % project.columns!.length;
					return { x: newX, y: Math.min(prev.y, project!.columns![newX].tasks!.length) };
				});
			}
			if (e.key === 'ArrowUp') {
				if (position.x !== -1) {
					return setPosition((prev) => {
						const mod = project!.columns![prev.x].tasks!.length + 2;
						const newY = ((prev.y + mod) % mod) - 1;
						return { x: prev.x, y: newY };
					});
				}
				return setPosition((prev) => {
					const newY = (prev.y + NUMBER_OF_ACTIONS - 1) % NUMBER_OF_ACTIONS;
					return { x: prev.x, y: newY };
				});
			}
			if (e.key === 'ArrowLeft') {
				return setPosition((prev) => {
					if (prev.x === 0) {
						return { x: -1, y: 0 };
					} else if (prev.x === -1) {
						return { x: project.columns!.length - 1, y: -1 };
					} else {
						const newX = (prev.x + project.columns!.length - 1) % project.columns!.length;
						return { x: newX, y: Math.min(prev.y, project!.columns![newX].tasks!.length) };
					}
				});
			}
			if (e.key === 'ArrowDown') {
				if (position.x !== -1) {
					return setPosition((prev) => {
						const mod = project!.columns![prev.x].tasks!.length + 2;
						const newY = ((prev.y + 2) % mod) - 1;
						return { x: prev.x, y: newY };
					});
				}
				return setPosition((prev) => {
					const newY = (prev.y + NUMBER_OF_ACTIONS + 1) % NUMBER_OF_ACTIONS;
					return { x: prev.x, y: newY };
				});
			}
			if (e.key === 'Escape') setUsingKeys(false);
			if (e.key === ' ' || e.key === 'Enter') {
				if (ref.current !== null) {
					const innerElement = ref.current?.querySelector('.focusable');
					if (!innerElement) return;
					(innerElement as HTMLElement).focus();
				}
			}
		};
		window.addEventListener('keyup', listener);

		ref.current?.focus();
		console.log({ position });
		return () => {
			window.removeEventListener('keyup', listener);
		};
	}, [project, project?.columns, project?.columns?.length, position, setPosition]);

	function register(column_id: number | null, task_id: number | null) {
		if (!isUsingKeys) return {};
		const registered = { tabIndex: -1, autoFocus: true, ref, 'data-highlightedbynav': true };

		if (position.x === -1) {
			// console.log(column_id);
			if (column_id === -1 && task_id === position.y) return { tabIndex: 0, ref };
		}

		const col = project?.columns![position.x]!;
		if (!col) return {};

		if (position.y === -1) {
			const shouldHighlight = column_id === col.id && task_id === -1;

			return shouldHighlight ? registered : {};
		}

		const task = col!.tasks![position.y];
		if (task) {
			return task.id === task_id ? registered : {};
		}
		return col.id === column_id && task_id === null ? registered : {};
	}

	return <ProjectKeyboardNavigationContext.Provider value={register}>{children}</ProjectKeyboardNavigationContext.Provider>;
};
